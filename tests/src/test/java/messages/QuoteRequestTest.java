package messages;

import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Value;
import org.junit.jupiter.api.Test;

import agrona.messages.MessageHeaderDecoder;
import agrona.messages.QuoteRequestDecoder;
import utils.Utils;

import java.io.IOException;

import org.agrona.concurrent.UnsafeBuffer;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import static org.junit.jupiter.api.Assertions.*;

public class QuoteRequestTest {
    private static final Logger log = LogManager.getLogger(QuoteRequestTest.class);

    @Test
    public void testQuoteRequest() throws IOException {
        log.info("In testQuoteRequest");
        System.out.println("Test Working Directory: " + System.getProperty("user.dir"));

        // GraalVM context
        Context context = Context.newBuilder("js").allowAllAccess(true).build();
    
        // Redirect console
        context.eval("js", "console.log = function(...args) { java.lang.System.out.println(args.map(String).join(' ')); };");

        // Load and prepare scripts
        String textEncoderScript = Utils.loadScript("tests/src/test/java/aeron/TextEncoder.js");
        String decimalEncoderScript = Utils.convertES6ToCommonJS(Utils.loadScript("frontend/src/messages/DecimalEncoder.js"));
        String MessageHeaderEncoderScript = Utils.convertES6ToCommonJS(Utils.loadScript("frontend/src/messages/MessageHeaderEncoder.js"));
        String quoteRequestEncoderScript = Utils.convertES6ToCommonJS(Utils.loadScript("frontend/src/messages/QuoteRequestEncoder.js"));
        String encodeQuoteRequestScript = Utils.convertES6ToCommonJS(Utils.loadScript("frontend/src/messages/encodeQuoteRequest.js"));

        // Concatenate scripts in the correct order
        String combinedScript = textEncoderScript + "\n" +
                                decimalEncoderScript + "\n" +
                                MessageHeaderEncoderScript + "\n" +
                                quoteRequestEncoderScript + "\n" +
                                encodeQuoteRequestScript;

        // Evaluate the combined script
        context.eval("js", combinedScript);

        // Test data
        String dataScript = "const data = {" +
                "amount: { mantissa: 100000, exponent: -2 }, " + 
                "saleCurrency: 'USD'," +
                "deliveryDate: '20240101'," +
                "transactTime: '20240101-00:00:00.000'," +
                "quoteRequestID: 'QR123456'," +
                "side: 'BUY'," +
                "symbol: 'EURUSD'," +
                "currencyOwned: 'EUR'," +
                "kycStatus: 2" +
                "};";
        context.eval("js", dataScript);

        log.info("Encode quote request");
        Value result = context.eval("js", "encodeQuoteRequest(data);");

        // Evaluate and create byte[] from ArrayBuffer
        context.getBindings("js").putMember("resultBuffer", result);
        Value byteView = context.eval("js", "new Uint8Array(resultBuffer);");

        int length = (int) byteView.getArraySize();
        byte[] encodedMessage = new byte[length];
        for (int i = 0; i < length; i++) {
            encodedMessage[i] = (byte) byteView.getArrayElement(i).asInt();
        }

        // Assertions
        assertNotNull(encodedMessage);
        assertTrue(encodedMessage.length > 0);

        // Use the Java decoder to decode the message
        UnsafeBuffer buffer = new UnsafeBuffer(encodedMessage);
        QuoteRequestDecoder quoteRequestDecoder = new QuoteRequestDecoder();
        MessageHeaderDecoder headerDecoder = new MessageHeaderDecoder();

        headerDecoder.wrap(buffer, 0);
        quoteRequestDecoder.wrapAndApplyHeader(buffer, 0, headerDecoder);

        // Verify the decoded message
        assertEquals(100000, quoteRequestDecoder.amount().mantissa());
        assertEquals(-2, quoteRequestDecoder.amount().exponent());
        assertEquals("USD", quoteRequestDecoder.saleCurrency());
        assertEquals("BUY", quoteRequestDecoder.side());
        assertEquals("EURUSD", quoteRequestDecoder.symbol());
        assertEquals("20240101", quoteRequestDecoder.deliveryDate());
        assertEquals("20240101-00:00:00.000", quoteRequestDecoder.transactTime());
        assertEquals("QR123456", quoteRequestDecoder.quoteRequestID());
        assertEquals("EUR", quoteRequestDecoder.currencyOwned());

        context.close();
        log.info("Out testQuoteRequest");
    }      
}
