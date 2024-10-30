package aeron;

import java.time.Duration;
import java.time.Instant;

import org.agrona.DirectBuffer;
import org.agrona.concurrent.UnsafeBuffer;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import io.aeron.Publication;

public class AeronSender {
    private static final Logger log = LogManager.getLogger(AeronSender.class);
    private Publication publisher;
    private static final long TIMEOUT_IN_SECONDS = 10;

    public void setPublication(Publication publisher) {
        this.publisher = publisher;
    }

    public void send(DirectBuffer message, String type) {
        publishWithTimeout(publisher, message, type);
    }

    public void sendTestMessage(String message) {
        UnsafeBuffer buffer = new UnsafeBuffer(message.getBytes());
        log.info("Sending test message: {}", message);
        send(buffer, "test");
    }

    private void publishWithTimeout(Publication publication, DirectBuffer message, String type) {
        long result;
        boolean report = true;
        Instant startTime = Instant.now();

        do {
            result = publication.offer(message);
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

