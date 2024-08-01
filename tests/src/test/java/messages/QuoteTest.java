package messages;

import org.agrona.DirectBuffer;
import org.junit.jupiter.api.Test;

import aeron.SbeEncoder;
import agrona.messages.MessageHeaderDecoder;
import agrona.messages.QuoteDecoder;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import static org.junit.jupiter.api.Assertions.assertEquals;

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
                 "Q12345", "QR123456", 1.2345
        );

        // Decode the message
        QuoteDecoder quoteDecoder = new QuoteDecoder();
        quoteDecoder.wrap(dataBuffer, MessageHeaderDecoder.ENCODED_LENGTH, QuoteDecoder.BLOCK_LENGTH, QuoteDecoder.SCHEMA_VERSION);

        // Verify the decoded message
        assertEquals(100000, quoteDecoder.amount().mantissa());
        assertEquals(-2, quoteDecoder.amount().exponent());
        assertEquals("USD", quoteDecoder.currency());
        assertEquals("BUY", quoteDecoder.side());
        assertEquals("EURUSD", quoteDecoder.symbol());
        assertEquals("20240101-00:00:00.000", quoteDecoder.transactTime());
        assertEquals("QR123456", quoteDecoder.quoteRequestID());
        assertEquals("Q12345", quoteDecoder.quoteID());
        assertEquals(123450, quoteDecoder.fxRate().mantissa());
        assertEquals(-5, quoteDecoder.fxRate().exponent());

        log.info("Out testSbeQuote");
    }
}
