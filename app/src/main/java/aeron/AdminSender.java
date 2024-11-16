package aeron;

import io.aeron.Publication;
import sbe.SbeAdminEncoder;
import sbe.SbeEncoder;

import org.agrona.DirectBuffer;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class AdminSender {
    private static final Logger log = LogManager.getLogger(AdminSender.class);

    private final SbeAdminEncoder sbeAdminEncoder = new SbeAdminEncoder();
	private final SbeEncoder sbeEncoder = new SbeEncoder();
	private final AeronSender sender = new AeronSender();

    public void setSender(Publication publication, int timeout) {
        this.sender.setPublication(publication, timeout);
    }

    public void sendError(double amount, String currency, String side, String symbol, String deliveryDate, String transactTime,
                        String quoteRequestID, String quoteID, String dealRequestID, String dealID, double fxRate, 
                        double secondaryAmount, String clientID, String message) {

        DirectBuffer buffer = sbeEncoder.encodeError(amount, currency, side, symbol, deliveryDate, 
                                    transactTime, quoteRequestID, quoteID, dealRequestID, 
                                    dealID, fxRate, secondaryAmount, clientID, message);

        sender.send(buffer, "stp error");

        log.error("Error amount: {}, currency: {}, side: {}, symbol: {}, deliveryDate: {}, transactTime: {}, " +
        "quoteRequestID: {}, quoteID: {}, dealRequestID: {}, dealID: {}, fxRate: {}, secondaryAmount: {}, " +
        "clientID: {}, message: {}", 
        amount, currency, side, symbol, deliveryDate, transactTime, quoteRequestID, quoteID, dealRequestID, 
        dealID, fxRate, secondaryAmount, clientID, message);
}

    public void sendAdmin(messages.Admin admin) {

        DirectBuffer buffer = sbeAdminEncoder.encodeAdmin(
            admin.getApplicationName(), 
            admin.getInstanceId(), 
            admin.getEnvironment(),
            admin.getMessageType(), 
            admin.getTimestamp(), 
            admin.getDetailedMessage(), 
            admin.getHostInfo());

        sender.send(buffer, "stp admin");

        log.info(admin.toString());
    }
}
