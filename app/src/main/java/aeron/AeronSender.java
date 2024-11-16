package aeron;

import java.time.Duration;
import java.time.Instant;

import org.agrona.DirectBuffer;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import io.aeron.Publication;

public class AeronSender {
    private static final Logger log = LogManager.getLogger(AeronSender.class);
    private Publication publisher;
    private long TIMEOUT_IN_SECONDS = 5;

    public void setPublication(Publication publisher, int timeout) {
        this.publisher = publisher;
        this.TIMEOUT_IN_SECONDS = timeout;
    }

    public void send(DirectBuffer message, String type) {
        publishWithTimeout(publisher, message, type);
    }

    private void publishWithTimeout(Publication publication, DirectBuffer message, String type) {
        long result;
        boolean report = true;
        Instant startTime = Instant.now();

        do {
            result = publication.offer(message);
            if (result < 0L) {
                if (result == Publication.NOT_CONNECTED) {
                    log.warn("Publication [channel: {}, streamId: {}] not connected. Aborting publish.", 
                        publication.channel(), publication.streamId());
                    return;
                }

                if (report) {
                    reportPublicationFailure(publication, (int) result);
                    report = false; // Only log once
                }
            }
            
            if (Duration.between(startTime, Instant.now()).getSeconds() > TIMEOUT_IN_SECONDS) {
                log.error("Publication timed out after {} seconds", TIMEOUT_IN_SECONDS);
                return;
            }

        } while (result < 0L);
        
        log.info("Published {}", type);
    }

    private void reportPublicationFailure(Publication publication, int result) {
        String channel = publication.channel();
        int streamId = publication.streamId();

        switch (result) {
            case (int) Publication.ADMIN_ACTION -> log.warn("Publication [channel: {}, streamId: {}] has an admin action pending.", channel, streamId);
            case (int) Publication.BACK_PRESSURED -> log.warn("Publication [channel: {}, streamId: {}] is back-pressured.", channel, streamId);
            case (int) Publication.CLOSED -> log.error("Publication [channel: {}, streamId: {}] is closed.", channel, streamId);
            case (int) Publication.MAX_POSITION_EXCEEDED -> log.error("Publication [channel: {}, streamId: {}] has reached max position.", channel, streamId);
            case (int) Publication.NOT_CONNECTED -> log.error("Publication [channel: {}, streamId: {}] is not connected.", channel, streamId);
            default -> log.error("Unknown publication error [{}]: [channel: {}, streamId: {}]", result, channel, streamId);
        }
    }
}

