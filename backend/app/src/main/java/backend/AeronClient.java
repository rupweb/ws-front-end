package backend;

import io.aeron.Aeron;
import io.aeron.Publication;
import io.aeron.Subscription;
import io.aeron.driver.MediaDriver;
import io.aeron.logbuffer.FragmentHandler;
import org.agrona.concurrent.BackoffIdleStrategy;
import org.agrona.concurrent.IdleStrategy;
import org.agrona.concurrent.SigInt;
import org.agrona.concurrent.UnsafeBuffer;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class AeronClient {
    private static final Logger logger = LogManager.getLogger(AeronClient.class);
    private static final String CHANNEL = "aeron:udp?endpoint=localhost:40124";
    private static final int STREAM_ID = 1001;

    private final Aeron aeron;
    private final Publication publication;
    private final Subscription subscription;

    public AeronClient() {
        MediaDriver.Context mediaDriverCtx = new MediaDriver.Context()
            .aeronDirectoryName("/tmp/aeron-backend");
            
        MediaDriver mediaDriver = MediaDriver.launch(mediaDriverCtx);
        Aeron.Context ctx = new Aeron.Context().aeronDirectoryName(mediaDriver.aeronDirectoryName());
        aeron = Aeron.connect(ctx);

        publication = aeron.addPublication(CHANNEL, STREAM_ID);
        subscription = aeron.addSubscription(CHANNEL, STREAM_ID);
    }

    public void start() {
        logger.info("Starting Aeron client.");

        SigInt.register(() -> {
            logger.info("Shutdown signal received.");
            close();
        });

        FragmentHandler fragmentHandler = (buffer, offset, length, header) -> {
            byte[] data = new byte[length];
            buffer.getBytes(offset, data);
            String message = new String(data);
            logger.info("Received message: {}", message);
            WebSocketFrameHandler.broadcast(message);
        };

        listen(fragmentHandler);

        Runtime.getRuntime().addShutdownHook(new Thread(this::close));
    }

    public void listen(FragmentHandler fragmentHandler) {
        final IdleStrategy idleStrategy = new BackoffIdleStrategy(100, 1000, 1, 1);
        while (true) {
            final int fragments = subscription.poll(fragmentHandler, 10);
            idleStrategy.idle(fragments);
        }
    }

    public void sendMessage(byte[] encodedData) {
        UnsafeBuffer buffer = new UnsafeBuffer(encodedData);
        while (publication.offer(buffer) < 0L) {
            // Implement back-off or error handling here
        }
    }

    public void close() {
        publication.close();
        subscription.close();
        aeron.close();
    }
}
