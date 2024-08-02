package backend;

import org.agrona.concurrent.UnsafeBuffer;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import io.aeron.Publication;

public class BackendToFix {
    private static final Logger log = LogManager.getLogger(BackendToFix.class);
    private final Publication fixPublication;
    private final Errors errors;

    public BackendToFix(Publication fixPublication, Errors errors) {
        this.fixPublication = fixPublication;
        this.errors = errors;
    }

    public void sendMessage(byte[] encodedData) {
        log.debug("In sendMessage");
        UnsafeBuffer buffer = new UnsafeBuffer(encodedData);
        while (fixPublication.offer(buffer) < 0L) {
            // Implement back-off or error handling here
        }
    }

    public void sendTestMessage(String message) {
        byte[] encodedData = message.getBytes();
        log.info("Sending test message: {}", message);
        sendMessage(encodedData);
    }
}
