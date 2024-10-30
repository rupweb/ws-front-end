package aeron;

import org.agrona.concurrent.BackoffIdleStrategy;
import org.agrona.concurrent.IdleStrategy;
import org.agrona.concurrent.SigInt;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import backend.Errors;
import backend.WebSocketFrameHandler;
import io.aeron.Aeron;
import io.aeron.Publication;
import io.aeron.Subscription;
import io.aeron.logbuffer.FragmentHandler;
import io.micrometer.core.instrument.MeterRegistry;

public class AeronClient {
    private static final Logger log = LogManager.getLogger(AeronClient.class);
    public static final String BACKEND_TO_FIX_CHANNEL = "aeron:udp?endpoint=224.0.1.1:40101";
    public static final String FIX_TO_BACKEND_CHANNEL = "aeron:udp?endpoint=224.0.1.3:40102";
    public static final String ERROR_CHANNEL = "aeron:udp?endpoint=224.0.1.1:40150";
    public static final int BACKEND_TO_FIX_STREAM_ID = 1001;
    public static final int FIX_TO_BACKEND_STREAM_ID = 1002;
    public static final int ERROR_STREAM_ID = 1050;

    private Aeron aeron;
    private Subscription fixToBackendSubscription;
    private MeterRegistry registry;
    private Errors errors;
    private volatile boolean running;

    private final AeronSender aeronSender = new AeronSender();

	// Guided by tests
    public Aeron getAeron() { return aeron; }
    public Errors getErrors() { return errors; }
    public AeronSender getSender() { return aeronSender; }

    public void start(Aeron aeron, MeterRegistry registry) {
        log.info("In AeronClient");

        this.aeron = aeron;
        this.registry = registry;

        // Create Publications
        Publication backendToFixPublication = aeron.addPublication(BACKEND_TO_FIX_CHANNEL, BACKEND_TO_FIX_STREAM_ID);
        log.info("Backend to Fix Publication setup: channel={}, port={}, streamId={}", BACKEND_TO_FIX_CHANNEL, getPort(BACKEND_TO_FIX_CHANNEL), BACKEND_TO_FIX_STREAM_ID);

        Publication errorPublication = aeron.addPublication(ERROR_CHANNEL, ERROR_STREAM_ID);
        log.info("Error Publication setup: channel={}, port={}, streamId={}", ERROR_CHANNEL, getPort(ERROR_CHANNEL), ERROR_STREAM_ID);

        // Create Errors instance
        errors = new Errors();
        this.errors.setSender(errorPublication);

        // Create Sender instance
        this.aeronSender.setPublication(backendToFixPublication);

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
        final IdleStrategy idleStrategy = new BackoffIdleStrategy(100, 1000, 1, 1);
        while (running) {
            final int fragments = fixToBackendSubscription.poll(fragmentHandler, 10);
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
