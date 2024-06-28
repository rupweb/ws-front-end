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

public class QuoteTest {
    private static final Logger log = LogManager.getLogger(QuoteTest.class);

    @Test
    public void testSbeQuote() throws IOException {
        log.info("Running testSbeQuote");

        // Manually load classes and add them to the context
        try (Context context = Context.newBuilder("js")
                .allowAllAccess(true)
                .build()) {

            // Load JavaScript files
            String encodeQuote = new String(Files.readAllBytes(Paths.get("../frontend/src/messages/encodeQuote.js")));
            String decodeQuote = new String(Files.readAllBytes(Paths.get("../frontend/src/messages/decodeQuote.js")));

            log.info("Loaded JavaScript files");

            // Evaluate JavaScript files
            context.eval(Source.newBuilder("js", encodeQuote, "encodeQuote.js").build());
            context.eval(Source.newBuilder("js", decodeQuote, "decodeQuote.js").build());
            log.info("Evaluated JavaScript files");

            // Define the data to encode
            Value data = context.eval("js", "({ " +
                    "amount: { mantissa: 1000, exponent: 2 }, " +
                    "currency: 'USD', " +
                    "fxRate: { mantissa: 100, exponent: -2 }, " +
                    "transactTime: '20240101-00:00:00.000', " +
                    "side: 'BUY', " +
                    "symbol: 'AAPL', " +
                    "quoteID: 'Q123456', " +
                    "quoteRequestID: 'QR123456' })");

            // Call encodeQuote function
            Value encodeQuoteFunc = context.getBindings("js").getMember("encodeQuote");
            byte[] encodedMessage = encodeQuoteFunc.execute(data).as(byte[].class);
            log.info("Called encoder");

            // Call decodeQuote function
            Value decodeQuoteFunc = context.getBindings("js").getMember("decodeQuote");
            Value decodedMessage = decodeQuoteFunc.execute(encodedMessage);
            log.info("Called decoder");

            // Verify the decoded message
            assertEquals(1000, decodedMessage.getMember("amount").getMember("mantissa").asInt());
            assertEquals(2, decodedMessage.getMember("amount").getMember("exponent").asInt());
            assertEquals("USD", decodedMessage.getMember("currency").asString());
            assertEquals(100, decodedMessage.getMember("fxRate").getMember("mantissa").asInt());
            assertEquals(-2, decodedMessage.getMember("fxRate").getMember("exponent").asInt());
            assertEquals("20240101-00:00:00.000", decodedMessage.getMember("transactTime").asString());
            assertEquals("BUY", decodedMessage.getMember("side").asString());
            assertEquals("AAPL", decodedMessage.getMember("symbol").asString());
            assertEquals("Q123456", decodedMessage.getMember("quoteID").asString());
            assertEquals("QR123456", decodedMessage.getMember("quoteRequestID").asString());
        }

        log.info("Completed testSbeQuote");
    }
}
