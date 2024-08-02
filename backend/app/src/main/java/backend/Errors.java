package backend;

import io.aeron.Publication;
import messaging.SbeEncoder;

import org.agrona.DirectBuffer;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class Errors {
    private static final Logger log = LogManager.getLogger(Errors.class);
    private final Publication publication;
    private final SbeEncoder sbeEncoder = new SbeEncoder();

    public Errors(Publication publication) {
        this.publication = publication;
    }

    public void sendError(double amount, String currency, String side, String symbol, String deliveryDate, String transactTime,
                          String quoteRequestID, String quoteID, String dealRequestID, String dealID, double fxRate, String message) {

        DirectBuffer buffer = sbeEncoder.encodeError(amount, currency, side, symbol, deliveryDate, transactTime, quoteRequestID, quoteID, dealRequestID, dealID, fxRate, message);
        long result;
        do {
            result = publication.offer(buffer);
        } while (result < 0L);
        log.error("Sent error message: {}", message);
    }
}
