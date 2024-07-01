package messages;

import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Source;
import org.graalvm.polyglot.Value;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.agrona.concurrent.UnsafeBuffer;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ExecutionReportTest {
    private static final Logger log = LogManager.getLogger(ExecutionReportTest.class);

    @Test
    public void testSbeExecutionReport() throws IOException {
        log.info("Running testSbeExecutionReport");

        // Manually load classes and add them to the context
        try (Context context = Context.newBuilder("js")
                .allowAllAccess(true)
                .build()) {

            // Load JavaScript files
            String encodeExecutionReport = new String(Files.readAllBytes(Paths.get("../frontend/src/messages/encodeExecutionReport.js")));
            String decodeExecutionReport = new String(Files.readAllBytes(Paths.get("../frontend/src/messages/decodeExecutionReport.js")));

            log.info("Loaded JavaScript files");

            // Evaluate JavaScript files
            context.eval(Source.newBuilder("js", encodeExecutionReport, "encodeExecutionReport.js").build());
            context.eval(Source.newBuilder("js", decodeExecutionReport, "decodeExecutionReport.js").build());
            log.info("Evaluated JavaScript files");

            // Define the data to encode
            Value data = context.eval("js", "({ " +
                    "amount: { mantissa: 1000, exponent: 2 }, " +
                    "currency: 'USD', " +
                    "secondaryAmount: { mantissa: 500, exponent: 2 }, " +
                    "secondaryCurrency: 'EUR', " +
                    "side: 'BUY', " +
                    "symbol: 'AAPL', " +
                    "deliveryDate: '20240101', " +
                    "transactTime: '20240101-00:00:00.000', " +
                    "quoteRequestID: 'QR123456', " +
                    "quoteID: 'Q123456', " +
                    "dealRequestID: 'DR123456', " +
                    "dealID: 'D123456', " +
                    "fxRate: { mantissa: 100, exponent: -2 } })");

            // Call encodeExecutionReport function
            Value encodeExecutionReportFunc = context.getBindings("js").getMember("encodeExecutionReport");
            byte[] encodedMessage = encodeExecutionReportFunc.execute(data).as(byte[].class);
            log.info("Called encoder");

            // Call decodeExecutionReport function
            Value decodeExecutionReportFunc = context.getBindings("js").getMember("decodeExecutionReport");
            Value decodedMessage = decodeExecutionReportFunc.execute(encodedMessage);
            log.info("Called decoder");

            // Verify the decoded message
            assertEquals(1000, decodedMessage.getMember("amount").getMember("mantissa").asInt());
            assertEquals(2, decodedMessage.getMember("amount").getMember("exponent").asInt());
            assertEquals("USD", decodedMessage.getMember("currency").asString());
            assertEquals(500, decodedMessage.getMember("secondaryAmount").getMember("mantissa").asInt());
            assertEquals(2, decodedMessage.getMember("secondaryAmount").getMember("exponent").asInt());
            assertEquals("EUR", decodedMessage.getMember("secondaryCurrency").asString());
            assertEquals("BUY", decodedMessage.getMember("side").asString());
            assertEquals("AAPL", decodedMessage.getMember("symbol").asString());
            assertEquals("20240101", decodedMessage.getMember("deliveryDate").asString());
            assertEquals("20240101-00:00:00.000", decodedMessage.getMember("transactTime").asString());
            assertEquals("QR123456", decodedMessage.getMember("quoteRequestID").asString());
            assertEquals("Q123456", decodedMessage.getMember("quoteID").asString());
            assertEquals("DR123456", decodedMessage.getMember("dealRequestID").asString());
            assertEquals("D123456", decodedMessage.getMember("dealID").asString());
            assertEquals(100, decodedMessage.getMember("fxRate").getMember("mantissa").asInt());
            assertEquals(-2, decodedMessage.getMember("fxRate").getMember("exponent").asInt());
        }

        log.info("Completed testSbeExecutionReport");
    }
}
