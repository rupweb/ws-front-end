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

public class DealRequestTest {
    private static final Logger log = LogManager.getLogger(DealRequestTest.class);

    @Test
    public void testSbeDealRequest() throws IOException {
        log.info("Running testSbeDealRequest");

        // Manually load classes and add them to the context
        try (Context context = Context.newBuilder("js")
                .allowAllAccess(true)
                .build()) {

            // Load JavaScript files
            String encodeDealRequest = new String(Files.readAllBytes(Paths.get("../frontend/src/messages/encodeDealRequest.js")));
            String decodeDealRequest = new String(Files.readAllBytes(Paths.get("../frontend/src/messages/decodeDealRequest.js")));

            log.info("Loaded JavaScript files");

            // Evaluate JavaScript files
            context.eval(Source.newBuilder("js", encodeDealRequest, "encodeDealRequest.js").build());
            context.eval(Source.newBuilder("js", decodeDealRequest, "decodeDealRequest.js").build());
            log.info("Evaluated JavaScript files");

            // Define the data to encode
            Value data = context.eval("js", "({ " +
                    "amount: { mantissa: 1000, exponent: 2 }, " +
                    "currency: 'USD', " +
                    "side: 'BUY', " +
                    "symbol: 'AAPL', " +
                    "deliveryDate: '20240101', " +
                    "transactTime: '20240101-00:00:00.000', " +
                    "quoteRequestID: 'QR123456', " +
                    "quoteID: 'Q123456', " +
                    "dealRequestID: 'DR123456', " +
                    "ticketRef: 'T123456', " +
                    "fxRate: { mantissa: 100, exponent: -2 } })");

            // Call encodeDealRequest function
            Value encodeDealRequestFunc = context.getBindings("js").getMember("encodeDealRequest");
            byte[] encodedMessage = encodeDealRequestFunc.execute(data).as(byte[].class);
            log.info("Called encoder");

            // Call decodeDealRequest function
            Value decodeDealRequestFunc = context.getBindings("js").getMember("decodeDealRequest");
            Value decodedMessage = decodeDealRequestFunc.execute(encodedMessage);
            log.info("Called decoder");

            // Verify the decoded message
            assertEquals(1000, decodedMessage.getMember("amount").getMember("mantissa").asInt());
            assertEquals(2, decodedMessage.getMember("amount").getMember("exponent").asInt());
            assertEquals("USD", decodedMessage.getMember("currency").asString());
            assertEquals("BUY", decodedMessage.getMember("side").asString());
            assertEquals("AAPL", decodedMessage.getMember("symbol").asString());
            assertEquals("20240101", decodedMessage.getMember("deliveryDate").asString());
            assertEquals("20240101-00:00:00.000", decodedMessage.getMember("transactTime").asString());
            assertEquals("QR123456", decodedMessage.getMember("quoteRequestID").asString());
            assertEquals("Q123456", decodedMessage.getMember("quoteID").asString());
            assertEquals("DR123456", decodedMessage.getMember("dealRequestID").asString());
            assertEquals("T123456", decodedMessage.getMember("ticketRef").asString());
            assertEquals(100, decodedMessage.getMember("fxRate").getMember("mantissa").asInt());
            assertEquals(-2, decodedMessage.getMember("fxRate").getMember("exponent").asInt());
        }

        log.info("Completed testSbeDealRequest");
    }
}
