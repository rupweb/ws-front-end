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
    private static final Logger log = LogManager.getLogger(AeronClient.class);
    private static final String BACKEND_TO_FIX_CHANNEL = "aeron:udp?endpoint=224.0.1.1:40135";
    private static final String FIX_TO_BACKEND_CHANNEL = "aeron:udp?endpoint=224.0.1.3:40136";
    private static final int STREAM_ID_BACKEND_FIX = 1002;
    private static final int STREAM_ID_FIX_BACKEND = 1003;

    private final Aeron aeron;
    private final Publication backendToFixPublication;
    private final Subscription fixToBackendSubscription;

    public AeronClient() {
        log.info("In AeronClient");

        MediaDriver.Context mediaDriverCtx = new MediaDriver.Context()
            .aeronDirectoryName("/tmp/aeron-backend")
            .dirDeleteOnStart(true);

        MediaDriver mediaDriver = MediaDriver.launch(mediaDriverCtx);
        Aeron.Context ctx = new Aeron.Context().aeronDirectoryName(mediaDriver.aeronDirectoryName());
        aeron = Aeron.connect(ctx);

        backendToFixPublication = aeron.addPublication(BACKEND_TO_FIX_CHANNEL, STREAM_ID_BACKEND_FIX);
        fixToBackendSubscription = aeron.addSubscription(FIX_TO_BACKEND_CHANNEL, STREAM_ID_FIX_BACKEND);

        log.info("Backend to Fix Publication setup: channel={}, port={}, streamId={}", BACKEND_TO_FIX_CHANNEL, getPort(BACKEND_TO_FIX_CHANNEL), STREAM_ID_BACKEND_FIX);
        log.info("Fix to Backend Subscription setup: channel={}, port={}, streamId={}", FIX_TO_BACKEND_CHANNEL, getPort(FIX_TO_BACKEND_CHANNEL), STREAM_ID_FIX_BACKEND);
    }

    private String getPort(String channel) {
        return channel.substring(channel.lastIndexOf(':') + 1);
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
            String message = new String(data);
            log.info("Received message: {}", message);
            WebSocketFrameHandler.broadcast(message);
        };

        // Send a test message
        sendTestMessage("Hello from backend!");

        listen(fragmentHandler);

        Runtime.getRuntime().addShutdownHook(new Thread(this::close));

        log.info("Out start");
    }

    public void listen(FragmentHandler fragmentHandler) {
        log.info("In listen");
        final IdleStrategy idleStrategy = new BackoffIdleStrategy(100, 1000, 1, 1);
        while (true) {
            final int fragments = fixToBackendSubscription.poll(fragmentHandler, 10);
            idleStrategy.idle(fragments);
        }
    }

    public void sendMessageToFix(byte[] encodedData) {
        log.info("In sendMessageToFix");
        UnsafeBuffer buffer = new UnsafeBuffer(encodedData);
        while (backendToFixPublication.offer(buffer) < 0L) {
            // Implement back-off or error handling here
        }
    }

    public void sendTestMessage(String message) {
        byte[] encodedData = message.getBytes();
        log.info("Sending test message: {}", message);
        sendMessageToFix(encodedData);
    }

    public void close() {
        log.info("In close");
        backendToFixPublication.close();
        fixToBackendSubscription.close();
        aeron.close();
        log.info("Out close");
    }
}
