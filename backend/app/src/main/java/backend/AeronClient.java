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
    private static final String SERVER_TO_CLIENT_CHANNEL = "aeron:udp?endpoint=localhost:40123";
    private static final String CLIENT_TO_SERVER_CHANNEL = "aeron:udp?endpoint=localhost:40124";
    private static final int STREAM_ID = 1001;

    private final Aeron aeron;
    private final Publication clientToServerPublication;
    private final Subscription serverToClientSubscription;

    public AeronClient() {
        log.info("In AeronClient");

        MediaDriver.Context mediaDriverCtx = new MediaDriver.Context()
            .aeronDirectoryName("/tmp/aeron-initiator");

        MediaDriver mediaDriver = MediaDriver.launch(mediaDriverCtx);
        Aeron.Context ctx = new Aeron.Context().aeronDirectoryName(mediaDriver.aeronDirectoryName());
        aeron = Aeron.connect(ctx);

        clientToServerPublication = aeron.addPublication(CLIENT_TO_SERVER_CHANNEL, STREAM_ID);
        serverToClientSubscription = aeron.addSubscription(SERVER_TO_CLIENT_CHANNEL, STREAM_ID);

        log.info("Client to Server Publication setup: channel={}, port={}, streamId={}", CLIENT_TO_SERVER_CHANNEL, getPort(CLIENT_TO_SERVER_CHANNEL), STREAM_ID);
        log.info("Server to Client Subscription setup: channel={}, port={}, streamId={}", SERVER_TO_CLIENT_CHANNEL, getPort(SERVER_TO_CLIENT_CHANNEL), STREAM_ID);
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
        sendTestMessage("Hello from AeronClient!");    

        listen(fragmentHandler);

        Runtime.getRuntime().addShutdownHook(new Thread(this::close));

        log.info("Out start");
    }

    public void listen(FragmentHandler fragmentHandler) {
        log.info("In listen");
        final IdleStrategy idleStrategy = new BackoffIdleStrategy(100, 1000, 1, 1);
        while (true) {
            final int fragments = serverToClientSubscription.poll(fragmentHandler, 10);
            idleStrategy.idle(fragments);
        }
    }

    public void sendMessage(byte[] encodedData) {
        log.info("In sendMessage");
        UnsafeBuffer buffer = new UnsafeBuffer(encodedData);
        while (clientToServerPublication.offer(buffer) < 0L) {
            // Implement back-off or error handling here
        }
    }

    public void sendTestMessage(String message) {
        byte[] encodedData = message.getBytes();
        log.info("Sending test message: {}", message);
        sendMessage(encodedData);
    }

    public void close() {
        log.info("In close");
        clientToServerPublication.close();
        serverToClientSubscription.close();
        aeron.close();
        log.info("Out close");
    }
}
