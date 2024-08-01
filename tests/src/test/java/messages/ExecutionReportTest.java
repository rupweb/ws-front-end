package messages;

import org.agrona.DirectBuffer;
import org.junit.jupiter.api.Test;

import aeron.SbeEncoder;
import agrona.messages.MessageHeaderDecoder;
import agrona.messages.ExecutionReportDecoder;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import static org.junit.jupiter.api.Assertions.assertEquals;

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
                "QR123456", "Q12345", "DR123456", "D12345", 1.2345
        );

        // Decode the message
        ExecutionReportDecoder executionReportDecoder = new ExecutionReportDecoder();
        executionReportDecoder.wrap(dataBuffer, MessageHeaderDecoder.ENCODED_LENGTH, ExecutionReportDecoder.BLOCK_LENGTH, ExecutionReportDecoder.SCHEMA_VERSION);

        // Verify the decoded message
        assertEquals(100000, executionReportDecoder.amount().mantissa());
        assertEquals(-2, executionReportDecoder.amount().exponent());
        assertEquals("USD", executionReportDecoder.currency());
        assertEquals(200000, executionReportDecoder.secondaryAmount().mantissa());
        assertEquals(-2, executionReportDecoder.secondaryAmount().exponent());
        assertEquals("EUR", executionReportDecoder.secondaryCurrency());
        assertEquals("BUY", executionReportDecoder.side());
        assertEquals("EURUSD", executionReportDecoder.symbol());
        assertEquals("20240101", executionReportDecoder.deliveryDate());
        assertEquals("20240101-00:00:00.000", executionReportDecoder.transactTime());
        assertEquals("QR123456", executionReportDecoder.quoteRequestID());
        assertEquals("Q12345", executionReportDecoder.quoteID());
        assertEquals("DR123456", executionReportDecoder.dealRequestID());
        assertEquals("D12345", executionReportDecoder.dealID());
        assertEquals(123450, executionReportDecoder.fxRate().mantissa());
        assertEquals(-5, executionReportDecoder.fxRate().exponent());

        log.info("Out testSbeExecutionReport");
    }
}
