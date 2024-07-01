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

public class QuoteRequestTest {
    private static final Logger log = LogManager.getLogger(QuoteRequestTest.class);

    @Test
    public void testSbeQuoteRequest() throws IOException {
        log.info("Running testSbeQuoteRequest");

        // Manually load classes and add them to the context
        try (Context context = Context.newBuilder("js")
                .allowAllAccess(true)
                .build()) {  

            // Load JavaScript files
            String encodeQuoteRequest = new String(Files.readAllBytes(Paths.get("../frontend/src/messages/encodeQuoteRequest.js")));
            String decodeQuoteRequest = new String(Files.readAllBytes(Paths.get("../frontend/src/messages/decodeQuoteRequest.js")));

            log.info("Loaded JavaScript files");

            // Evaluate JavaScript files
            context.eval(Source.newBuilder("js", encodeQuoteRequest, "encodeQuoteRequest.js").build());
            context.eval(Source.newBuilder("js", decodeQuoteRequest, "decodeQuoteRequest.js").build());
            log.info("Evaluated JavaScript files");

            // Define the data to encode
            Value data = context.eval("js", "({ " +
                    "amount: { mantissa: 1000, exponent: 2 }, " +
                    "saleCurrency: 'USD', " +
                    "deliveryDate: '20240101', " +
                    "transactTime: '20240101-00:00:00.000', " +
                    "quoteRequestID: 'QR123456', " +
                    "side: 'BUY', " +
                    "symbol: 'AAPL', " +
                    "currencyOwned: 'USD', " +
                    "kycStatus: 2 })");

            // Call encodeQuoteRequest function
            Value encodeQuoteRequestFunc = context.getBindings("js").getMember("encodeQuoteRequest");
            byte[] encodedMessage = encodeQuoteRequestFunc.execute(data).as(byte[].class);
            log.info("Called encoder");

            // Call decodeQuoteRequest function
            Value decodeQuoteRequestFunc = context.getBindings("js").getMember("decodeQuoteRequest");
            Value decodedMessage = decodeQuoteRequestFunc.execute(encodedMessage);
            log.info("Called decoder");

            // Verify the decoded message
            assertEquals(1000, decodedMessage.getMember("amount").getMember("mantissa").asInt());
            assertEquals(2, decodedMessage.getMember("amount").getMember("exponent").asInt());
            assertEquals("USD", decodedMessage.getMember("saleCurrency").asString());
            assertEquals("20240101", decodedMessage.getMember("deliveryDate").asString());
            assertEquals("20240101-00:00:00.000", decodedMessage.getMember("transactTime").asString());
            assertEquals("QR123456", decodedMessage.getMember("quoteRequestID").asString());
            assertEquals("BUY", decodedMessage.getMember("side").asString());
            assertEquals("AAPL", decodedMessage.getMember("symbol").asString());
            assertEquals("USD", decodedMessage.getMember("currencyOwned").asString());
            assertEquals("VERIFIED", decodedMessage.getMember("kycStatus").asString());
        }

        log.info("Completed testSbeQuoteRequest");
    }
}
