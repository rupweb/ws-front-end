package messages;

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

    @Test
    public void testSbeQuote() {
        log.info("In testSbeQuote");
        System.out.println("Test Working Directory: " + System.getProperty("user.dir"));

        // Initialize the encoder
        SbeEncoder sbeEncoder = new SbeEncoder();

        // Define the data to encode
        DirectBuffer dataBuffer = sbeEncoder.encodeQuote(
                1000, "USD", "BUY", "EURUSD", "20240101-00:00:00.000",
                 "Q12345", "QR123456", 1.2345, 12345, "TEST"
        );

        // Decode the message
        QuoteDecoder decoder = new QuoteDecoder();
        decoder.wrap(dataBuffer, MessageHeaderDecoder.ENCODED_LENGTH, QuoteDecoder.BLOCK_LENGTH, QuoteDecoder.SCHEMA_VERSION);

        // Verify the decoded message
        assertEquals(100000, decoder.amount().mantissa());
        assertEquals(-2, decoder.amount().exponent());
        assertEquals("USD", decoder.currency());
        assertEquals("BUY", decoder.side());
        assertEquals("EURUSD", decoder.symbol());
        assertEquals("20240101-00:00:00.000", decoder.transactTime());
        assertEquals("QR123456", decoder.quoteRequestID());
        assertEquals("Q12345", decoder.quoteID());
        assertEquals(123450, decoder.fxRate().mantissa());
        assertEquals(-5, decoder.fxRate().exponent());
        assertEquals("TEST", decoder.clientID());

        log.info("Out testSbeQuote");
    }
}
