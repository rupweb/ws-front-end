package messages;

import java.util.UUID;

import org.agrona.DirectBuffer;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

import agrona.messages.ExecutionReportDecoder;
import agrona.messages.MessageHeaderDecoder;
import sbe.SbeEncoder;

public class ExecutionReportTest {
    private static final Logger log = LogManager.getLogger(ExecutionReportTest.class);

    // Define variables
    double amount;
    double secondaryAmount;
    String secondaryCurrency;
    String currency;
    String side;
    String symbol;
    String deliveryDate;
    String transactTime;
    String quoteID;     
    String quoteRequestID; 
    String dealRequestID;
    String dealID;
    String clientID;
    double fxRate;
    short processed;

    @Test
    public void testSbeExecutionReport() {
        log.info("In testSbeExecutionReport");
        System.out.println("Test Working Directory: " + System.getProperty("user.dir"));

        // Create a random GUID
        UUID uuid = UUID.randomUUID();
        String guid = uuid.toString().substring(0, 8).toUpperCase();

        // Define ExecutionReport data
        amount = 1000;
        secondaryAmount = 810.01;
        secondaryCurrency = "EUR";
        currency = "USD";
        side = "BUY";
        symbol = "EURUSD";
        deliveryDate = "20250101";
        transactTime = "20240101-00:00:00.000";
        quoteID = guid;     
        quoteRequestID = guid;   
        dealRequestID = guid;
        dealID = guid + ".1";
        clientID = "TEST";
        fxRate = 1.23456;
        processed = 0;

        // Initialize the encoder
        SbeEncoder sbeEncoder = new SbeEncoder();

        // Define the data to encode
        DirectBuffer dataBuffer = sbeEncoder.encodeExecutionReport(amount, currency, secondaryAmount, 
            secondaryCurrency, side, symbol, deliveryDate, transactTime, quoteID, quoteRequestID, 
            dealRequestID, dealID, clientID, fxRate, processed);

        // Decode the message
        ExecutionReportDecoder decoder = new ExecutionReportDecoder();
        decoder.wrap(dataBuffer, MessageHeaderDecoder.ENCODED_LENGTH, ExecutionReportDecoder.BLOCK_LENGTH, ExecutionReportDecoder.SCHEMA_VERSION);

        // Verify the decoded message
        assertEquals((long) (amount * 100), decoder.amount().mantissa());
        assertEquals(-2, decoder.amount().exponent());
        assertEquals(currency, decoder.currency());
        assertEquals((long) (secondaryAmount * 100), decoder.secondaryAmount().mantissa());
        assertEquals(-2, decoder.secondaryAmount().exponent());
        assertEquals(secondaryCurrency, decoder.secondaryCurrency());
        assertEquals(side, decoder.side());
        assertEquals(symbol, decoder.symbol());
        assertEquals(deliveryDate, decoder.deliveryDate());
        assertEquals(transactTime, decoder.transactTime());
        assertEquals(quoteRequestID, decoder.quoteRequestID());
        assertEquals(quoteID, decoder.quoteID());
        assertEquals(dealRequestID, decoder.dealRequestID());
        assertEquals(dealID, decoder.dealID());
        assertEquals((long) (fxRate * 100000), decoder.fxRate().mantissa());
        assertEquals(-5, decoder.fxRate().exponent());
        assertEquals(clientID, decoder.clientID());

        log.info("Received and verified deal message");

        log.info("Out testSbeExecutionReport");
    }
}
