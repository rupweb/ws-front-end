package messages;

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

    @Test
    public void testSbeExecutionReport() {
        log.info("In testSbeExecutionReport");
        System.out.println("Test Working Directory: " + System.getProperty("user.dir"));

        // Initialize the encoder
        SbeEncoder sbeEncoder = new SbeEncoder();

        // Define the data to encode
        DirectBuffer dataBuffer = sbeEncoder.encodeExecutionReport(
                1000.00, "USD", 2000, "EUR", "BUY", "EURUSD",
                "20240101", "20240101-00:00:00.000",
                "QR123456", "Q12345", "DR123456", "D12345", "TEST", 1.2345
        );

        // Decode the message
        ExecutionReportDecoder decoder = new ExecutionReportDecoder();
        decoder.wrap(dataBuffer, MessageHeaderDecoder.ENCODED_LENGTH, ExecutionReportDecoder.BLOCK_LENGTH, ExecutionReportDecoder.SCHEMA_VERSION);

        // Verify the decoded message
        assertEquals(100000, decoder.amount().mantissa());
        assertEquals(-2, decoder.amount().exponent());
        assertEquals("USD", decoder.currency());
        assertEquals(200000, decoder.secondaryAmount().mantissa());
        assertEquals(-2, decoder.secondaryAmount().exponent());
        assertEquals("EUR", decoder.secondaryCurrency());
        assertEquals("BUY", decoder.side());
        assertEquals("EURUSD", decoder.symbol());
        assertEquals("20240101", decoder.deliveryDate());
        assertEquals("20240101-00:00:00.000", decoder.transactTime());
        assertEquals("QR123456", decoder.quoteRequestID());
        assertEquals("Q12345", decoder.quoteID());
        assertEquals("DR123456", decoder.dealRequestID());
        assertEquals("D12345", decoder.dealID());
        assertEquals("TEST", decoder.clientID());
        assertEquals(123450, decoder.fxRate().mantissa());
        assertEquals(-5, decoder.fxRate().exponent());

        log.info("Out testSbeExecutionReport");
    }
}
