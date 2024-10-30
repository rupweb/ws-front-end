package messages;

import java.util.UUID;

import org.agrona.DirectBuffer;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

import agrona.messages.MessageHeaderDecoder;
import agrona.messages.QuoteDecoder;
import sbe.SbeEncoder;

public class QuoteTest {
    private static final Logger log = LogManager.getLogger(QuoteTest.class);

    // Define quote data
    double amount;
    String currency;
    String side;
    String symbol;
    String transactTime;
    String quoteID;     
    String quoteRequestID;
    double fxRate;
    String clientID;
    double secondaryAmount; 

    @Test
    public void testSbeQuote() {
        log.info("In testSbeQuote");
        System.out.println("Test Working Directory: " + System.getProperty("user.dir"));

        // Create a random GUID
        UUID uuid = UUID.randomUUID();
        String guid = uuid.toString().substring(0, 8).toUpperCase();

        // Populate quote data
        amount = 1000;
        currency = "USD";
        side = "BUY";
        symbol = "EURUSD";
        transactTime = "20240101-00:00:00.000";
        quoteID = guid;     
        quoteRequestID = guid;
        fxRate = 1.23456;
        clientID = "TEST";
        secondaryAmount = 810.01; 

        // Initialize the encoder
        SbeEncoder sbeEncoder = new SbeEncoder();

        // Define the data to encode
        DirectBuffer dataBuffer = sbeEncoder.encodeQuote(amount, currency, side, symbol, transactTime,
                                                    quoteID, quoteRequestID, fxRate, secondaryAmount, clientID);

        // Decode the message
        QuoteDecoder decoder = new QuoteDecoder();
        decoder.wrap(dataBuffer, MessageHeaderDecoder.ENCODED_LENGTH, QuoteDecoder.BLOCK_LENGTH, QuoteDecoder.SCHEMA_VERSION);

        // Verify the decoded message
        assertEquals((long) (amount * 100), decoder.amount().mantissa());
        assertEquals(-2, decoder.amount().exponent());
        assertEquals(currency, decoder.currency());
        assertEquals((long) (secondaryAmount * 100), decoder.secondaryAmount().mantissa());
        assertEquals(-2, decoder.secondaryAmount().exponent());
        assertEquals(side, decoder.side());
        assertEquals(symbol, decoder.symbol());
        assertEquals(transactTime, decoder.transactTime());
        assertEquals(quoteRequestID, decoder.quoteRequestID());
        assertEquals(quoteID, decoder.quoteID());
        assertEquals((long) (fxRate * 100000), decoder.fxRate().mantissa());
        assertEquals(-5, decoder.fxRate().exponent());
        assertEquals(clientID, decoder.clientID());

        log.info("Received and verified quote message");

        log.info("Out testSbeQuote");
    }
}
