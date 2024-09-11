package backend;

import java.time.Duration;
import java.time.Instant;

import org.agrona.DirectBuffer;
import org.agrona.concurrent.UnsafeBuffer;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import io.aeron.Publication;

public class BackendToFix {
    private static final Logger log = LogManager.getLogger(BackendToFix.class);
    private final Publication fixPublication;
    private final Errors errors;
    private static final long TIMEOUT_IN_SECONDS = 10;

    public BackendToFix(Publication fixPublication, Errors errors) {
        this.fixPublication = fixPublication;
        this.errors = errors;
    }

    public void sendMessage(byte[] encodedData) {
        log.debug("In sendMessage");
        UnsafeBuffer buffer = new UnsafeBuffer(encodedData);
        publishWithTimeout(fixPublication, buffer, "message");
    }

    public void sendTestMessage(String message) {
        byte[] encodedData = message.getBytes();
        log.info("Sending test message: {}", message);
        sendMessage(encodedData);
    }

    private void publishWithTimeout(Publication publication, DirectBuffer request, String type) {
        long result;
        boolean report = true;
        Instant startTime = Instant.now();

        do {
            result = publication.offer(request);
            if (result < 0L) {
                if (report) {
                    reportPublicationFailure((int) result);
                    report = false;
                }
            }
            
            if (Duration.between(startTime, Instant.now()).getSeconds() > TIMEOUT_IN_SECONDS) {
                log.error("Publication timed out after {} seconds", TIMEOUT_IN_SECONDS);
                return;
            }

        } while (result < 0L);
        
        log.info("Published {}", type);
    }

    private void reportPublicationFailure(int result) {
        switch (result) {
            case (int) Publication.NOT_CONNECTED -> log.error("Publication is not connected.");
            case (int) Publication.BACK_PRESSURED -> log.warn("Publication is back-pressured.");
            case (int) Publication.ADMIN_ACTION -> log.warn("Publication has an admin action pending.");
            default -> log.error("Unknown publication error: {}", result);
        }
    }
}
