package backend;

import io.aeron.Aeron;
import io.aeron.Publication;
import io.aeron.Subscription;
import io.aeron.logbuffer.FragmentHandler;

import org.agrona.concurrent.BackoffIdleStrategy;
import org.agrona.concurrent.IdleStrategy;
import org.agrona.concurrent.SigInt;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class AeronClient {
    private static final Logger log = LogManager.getLogger(AeronClient.class);
    private static final String BACKEND_TO_FIX_CHANNEL = "aeron:udp?endpoint=224.0.1.1:40101";
    private static final String FIX_TO_BACKEND_CHANNEL = "aeron:udp?endpoint=224.0.1.3:40102";
    public static final String ERROR_CHANNEL = "aeron:udp?endpoint=224.0.1.1:40150";
    private static final int BACKEND_TO_FIX_STREAM_ID = 1001;
    private static final int FIX_TO_BACKEND_STREAM_ID = 1002;
    public static final int ERROR_STREAM_ID = 1050;

    private final Aeron aeron;
    private final Subscription fixToBackendSubscription;
    private final BackendToFix backendToFix;
    private final Errors errors;
    private volatile boolean running;

    public AeronClient(Aeron aeron) {
        log.info("In AeronClient");

        this.aeron = aeron;

                // Create Publications
        Publication backendToFixPublication = aeron.addPublication(BACKEND_TO_FIX_CHANNEL, BACKEND_TO_FIX_STREAM_ID);
        log.info("Backend to Fix Publication setup: channel={}, port={}, streamId={}", BACKEND_TO_FIX_CHANNEL, getPort(BACKEND_TO_FIX_CHANNEL), BACKEND_TO_FIX_STREAM_ID);

        Publication errorPublication = aeron.addPublication(ERROR_CHANNEL, ERROR_STREAM_ID);
        log.info("Error Publication setup: channel={}, port={}, streamId={}", ERROR_CHANNEL, getPort(ERROR_CHANNEL), ERROR_STREAM_ID);

        // Create Errors instance
        this.errors = new Errors(errorPublication);

        // Create BackendToFix instance
        this.backendToFix = new BackendToFix(backendToFixPublication, errors);

        this.running = true;

        fixToBackendSubscription = aeron.addSubscription(FIX_TO_BACKEND_CHANNEL, FIX_TO_BACKEND_STREAM_ID);
        log.info("Fix to Backend Subscription setup: channel={}, port={}, streamId={}", FIX_TO_BACKEND_CHANNEL, getPort(FIX_TO_BACKEND_CHANNEL), FIX_TO_BACKEND_STREAM_ID);
    }

    // For testing
    public Errors getErrors() { return errors; }
    public BackendToFix getBackendToFix() { return backendToFix; }

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
        final IdleStrategy idleStrategy = new BackoffIdleStrategy(100, 1000, 1, 1);
        while (running) {
            final int fragmentsFixToPricer = fixToBackendSubscription.poll(fragmentHandler, 10);
            idleStrategy.idle(fragmentsFixToPricer);
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
