package aeron;

import org.agrona.concurrent.BackoffIdleStrategy;
import org.agrona.concurrent.IdleStrategy;
import org.agrona.concurrent.SigInt;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import app.AppConfig;
import backend.WebSocketFrameHandler;
import io.aeron.Aeron;
import io.aeron.Subscription;
import io.aeron.logbuffer.FragmentHandler;
import io.micrometer.core.instrument.MeterRegistry;

public class AeronErrorClient {
    private static final Logger log = LogManager.getLogger(AeronErrorClient.class);
    public static String ADMIN_CHANNEL = "aeron:udp?endpoint=224.0.1.1:40150";
    public static int ADMIN_STREAM_ID = 1050;
    public static int TIMEOUT_IN_SECONDS = 5;

    private final int fragmentLimit;
    private final IdleStrategy idleStrategy;

    public AeronErrorClient(AppConfig config) {

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
    private Subscription errorSubscription;
    private MeterRegistry registry;
    private volatile boolean running;

	// Guided by tests
	public boolean getRunning() { return running; }
    public Aeron getAeron() { return aeron; }

    public void start(Aeron aeron, MeterRegistry registry) {
        log.info("In AeronClient");

        this.aeron = aeron;
        this.registry = registry;

        this.running = true;

        errorSubscription = aeron.addSubscription(ADMIN_CHANNEL, ADMIN_STREAM_ID);
        log.info("Admin Subscription setup: channel={}, port={}, streamId={}", ADMIN_CHANNEL, getPort(ADMIN_CHANNEL), ADMIN_STREAM_ID);

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
        log.info("Stopping AeronErrorClient...");
        running = false;
    }

    public void start() {
        log.info("In start");

        SigInt.register(() -> {
            log.info("Shutdown signal received.");
            close();
        });

        FragmentHandler fragmentHandler = (buffer, offset, length, header) -> {
            log.debug("Received subscription message");
            byte[] data = new byte[length];
            buffer.getBytes(offset, data);
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
            final int fragmentsError = errorSubscription.poll(fragmentHandler, fragmentLimit);
            idleStrategy.idle(fragmentsError);
        }
        log.info("Out listen");
    }

    public void close() {
        log.info("In close");

        if (errorSubscription != null)
            errorSubscription.close();

        if (aeron != null)
            aeron.close();

        log.info("Out close");
    }
}
