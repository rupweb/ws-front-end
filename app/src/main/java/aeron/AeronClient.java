package aeron;

import org.agrona.concurrent.BackoffIdleStrategy;
import org.agrona.concurrent.IdleStrategy;
import org.agrona.concurrent.SigInt;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import backend.WebSocketFrameHandler;
import io.aeron.Aeron;
import io.aeron.Publication;
import io.aeron.Subscription;
import io.aeron.logbuffer.FragmentHandler;
import io.micrometer.core.instrument.MeterRegistry;
import sharedJava.AppConfig;
import sharedJava.aeron.AdminSender;

public class AeronClient {
    private static final Logger log = LogManager.getLogger(AeronClient.class);
    public static String BACKEND_TO_FIX_CHANNEL = "aeron:udp?control=127.0.0.1:40101|control-mode=dynamic";
    public static String FIX_TO_BACKEND_CHANNEL = "aeron:udp?control=127.0.0.1:40102|endpoint=127.0.0.1:40502|control-mode=dynamic";
    public static String ADMIN_CHANNEL = "aeron:udp?control=127.0.0.1:40150|control-mode=dynamic";
    public static int BACKEND_TO_FIX_STREAM_ID = 1001;
    public static int FIX_TO_BACKEND_STREAM_ID = 1002;
    public static int ADMIN_STREAM_ID = 1050;

    public static int TIMEOUT_IN_SECONDS = 5;

    private final int fragmentLimit;
    private final IdleStrategy idleStrategy;

    public AeronClient(AppConfig config) {
        if (config.getProperty("aeron.backendToFix.channel") != null) {
            this.BACKEND_TO_FIX_CHANNEL = config.getProperty("aeron.backendToFix.channel");
        }
    
        if (config.getIntProperty("aeron.backendToFix.streamId") != null) {
            this.BACKEND_TO_FIX_STREAM_ID = config.getIntProperty("aeron.backendToFix.streamId");
        }
    
        if (config.getProperty("aeron.fixToBackend.channel") != null) {
            this.FIX_TO_BACKEND_CHANNEL = config.getProperty("aeron.fixToBackend.channel");
        }
    
        if (config.getIntProperty("aeron.fixToBackend.streamId") != null) {
            this.FIX_TO_BACKEND_STREAM_ID= config.getIntProperty("aeron.fixToBackend.streamId");
        }
    
        if (config.getProperty("aeron.admin.channel") != null) {
            this.ADMIN_CHANNEL = config.getProperty("aeron.admin.channel");
        }
    
        if (config.getIntProperty("aeron.admin.streamId") != null) {
            this.ADMIN_STREAM_ID = config.getIntProperty("aeron.admin.streamId");
        }
    
        if (config.getIntProperty("publish.timeout") != null) {
            this.TIMEOUT_IN_SECONDS = config.getIntProperty("publish.timeout");
        }
    
        if (config.getIntProperty("aeron.fragmentLimit") != null) {
            this.fragmentLimit = config.getIntProperty("aeron.fragmentLimit");
        } else {
            this.fragmentLimit = 10; // Default value
        }
    
        this.idleStrategy = new BackoffIdleStrategy(
            config.getIntProperty("aeron.idleStrategy.maxSpins") != null ? config.getIntProperty("aeron.idleStrategy.maxSpins") : 100,
            config.getIntProperty("aeron.idleStrategy.maxYields") != null ? config.getIntProperty("aeron.idleStrategy.maxYields") : 1000,
            config.getIntProperty("aeron.idleStrategy.minParkNanos") != null ? config.getIntProperty("aeron.idleStrategy.minParkNanos") : 100000,
            config.getIntProperty("aeron.idleStrategy.maxParkNanos") != null ? config.getIntProperty("aeron.idleStrategy.maxParkNanos") : 1000000
        );
    }

    private Aeron aeron;
    private Subscription fixToBackendSubscription;
    private MeterRegistry registry;
    private volatile boolean running;

    private final AdminSender adminSender = new AdminSender();  
    public AdminSender getAdminSender() { return adminSender; }

    private final AeronSender aeronSender = new AeronSender();
    public AeronSender getSender() { return aeronSender; }

	// Guided by tests
    public Aeron getAeron() { return aeron; }

    public void start(Aeron aeron, MeterRegistry registry) {
        log.info("In AeronClient");

        this.aeron = aeron;
        this.registry = registry;

        // Create Publications
        Publication backendToFixPublication = aeron.addPublication(BACKEND_TO_FIX_CHANNEL, BACKEND_TO_FIX_STREAM_ID);
        log.info("Backend to Fix Publication setup: channel={}, port={}, streamId={}", BACKEND_TO_FIX_CHANNEL, getPort(BACKEND_TO_FIX_CHANNEL), BACKEND_TO_FIX_STREAM_ID);

        Publication adminPublication = aeron.addPublication(ADMIN_CHANNEL, ADMIN_STREAM_ID);
        log.info("Admin Publication setup: channel={}, port={}, streamId={}", ADMIN_CHANNEL, getPort(ADMIN_CHANNEL), ADMIN_STREAM_ID);

        // Create admin instance
        this.adminSender.setSender(adminPublication, TIMEOUT_IN_SECONDS);

        // Create Sender instance
        this.aeronSender.setPublication(backendToFixPublication, TIMEOUT_IN_SECONDS);

        this.running = true;

        fixToBackendSubscription = aeron.addSubscription(FIX_TO_BACKEND_CHANNEL, FIX_TO_BACKEND_STREAM_ID);
        log.info("Fix to Backend Subscription setup: channel={}, port={}, streamId={}", FIX_TO_BACKEND_CHANNEL, getPort(FIX_TO_BACKEND_CHANNEL), FIX_TO_BACKEND_STREAM_ID);
    
        // Start the listener thread
        Thread.startVirtualThread(this::start);
    }

    private String getPort(String channel) {
        return channel.substring(channel.lastIndexOf(':') + 1);
    }

    public boolean isRunning() {
        return running;
    }

    public void stop() {
        log.info("Stopping AeronClient...");
        running = false;
    }

    public void start() {
        log.info("In start");

        SigInt.register(() -> {
            log.info("Shutdown signal received.");
            close();
        });

        FragmentHandler fragmentHandler = (buffer, offset, length, header) -> {
            byte[] data = new byte[length];
            buffer.getBytes(offset, data);

            // Print as hex string
            String hex = java.util.HexFormat.of().formatHex(data);
            log.info("Received buffer as hex: {}", hex);

            WebSocketFrameHandler.broadcast(data);
        };

        listen(fragmentHandler);

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            log.info("Shutdown hook triggered.");
            close();
        }));

        log.info("Out start");
    }

    private void listen(FragmentHandler fragmentHandler) {
        log.info("In listen");

        while (running) {
            final int fragments = fixToBackendSubscription.poll(fragmentHandler, fragmentLimit);
            idleStrategy.idle(fragments);
        }
        log.info("Out listen");
    }

    public void close() {
        log.info("In close");

        if (fixToBackendSubscription != null)
            fixToBackendSubscription.close();

        if (aeron != null)
            aeron.close();

        log.info("Out close");
    }
}
