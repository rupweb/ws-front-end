package aeron;

import org.agrona.concurrent.BackoffIdleStrategy;
import org.agrona.concurrent.IdleStrategy;
import org.agrona.concurrent.SigInt;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import backend.WebSocketFrameHandler;
import io.aeron.Aeron;
import io.aeron.Subscription;
import io.aeron.logbuffer.FragmentHandler;
import io.micrometer.core.instrument.MeterRegistry;

public class AeronErrorClient {
    private static final Logger log = LogManager.getLogger(AeronErrorClient.class);
    public static final String ERROR_CHANNEL = "aeron:udp?endpoint=224.0.1.1:40150";
    public static final int ERROR_STREAM_ID = 1050;

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

        errorSubscription = aeron.addSubscription(ERROR_CHANNEL, ERROR_STREAM_ID);
        log.info("Error channel subscription setup: channel={}, port={}, streamId={}", ERROR_CHANNEL, getPort(ERROR_CHANNEL), ERROR_STREAM_ID);

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
        final IdleStrategy idleStrategy = new BackoffIdleStrategy(100, 1000, 1, 1);
        while (running) {
            final int fragmentsError = errorSubscription.poll(fragmentHandler, 10);
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