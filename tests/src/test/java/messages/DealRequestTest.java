package messages;

import org.agrona.concurrent.UnsafeBuffer;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Value;
import org.junit.jupiter.api.Test;

import agrona.messages.DealRequestDecoder;
import agrona.messages.MessageHeaderDecoder;
import utils.Utils;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class DealRequestTest {
    private static final Logger log = LogManager.getLogger(DealRequestTest.class);

    @Test
    public void testDealRequest() throws IOException {
        log.info("In testDealRequest");
        System.out.println("Test Working Directory: " + System.getProperty("user.dir"));

        // GraalVM context
        Context context = Context.newBuilder("js").allowAllAccess(true).build();
    
        // Redirect console
        context.eval("js", "console.log = function(...args) { java.lang.System.out.println(args.map(String).join(' ')); };");

        // Load and prepare scripts
        String textEncoderScript = Utils.loadScript("tests/src/test/java/aeron/TextEncoder.js");
        String decimalEncoderScript = Utils.convertES6ToCommonJS(Utils.loadScript("frontend/src/messages/DecimalEncoder.js"));
        String MessageHeaderEncoderScript = Utils.convertES6ToCommonJS(Utils.loadScript("frontend/src/messages/MessageHeaderEncoder.js"));
        String dealRequestEncoderScript = Utils.convertES6ToCommonJS(Utils.loadScript("frontend/src/messages/DealRequestEncoder.js"));
        String encodeDealRequestScript = Utils.convertES6ToCommonJS(Utils.loadScript("frontend/src/messages/encodeDealRequest.js"));

        // Concatenate scripts in the correct order
        String combinedScript = textEncoderScript + "\n" +
                                decimalEncoderScript + "\n" +
                                MessageHeaderEncoderScript + "\n" +
                                dealRequestEncoderScript + "\n" +
                                encodeDealRequestScript;

        // Evaluate the combined script
        context.eval("js", combinedScript);

        // Test data
        String dataScript = "const data = {" +
                    "amount: { mantissa: 1000, exponent: 2 }, " +
                    "currency: 'USD', " +
                    "side: 'BUY', " +
                    "symbol: 'EURUSD', " +
                    "deliveryDate: '20240201', " +
                    "transactTime: '20240101-00:00:00.000', " +
                    "quoteRequestID: 'QR123456', " +
                    "quoteID: 'Q123456', " +
                    "dealRequestID: 'DR123456', " +
                    "fxRate: { mantissa: 100, exponent: -2 }" +
                    "};";
        context.eval("js", dataScript);

        log.info("Encode deal request");
        Value result = context.eval("js", "encodeDealRequest(data);");

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
        DealRequestDecoder dealRequestDecoder = new DealRequestDecoder();
        MessageHeaderDecoder headerDecoder = new MessageHeaderDecoder();

        headerDecoder.wrap(buffer, 0);
        dealRequestDecoder.wrapAndApplyHeader(buffer, 0, headerDecoder);

        // Verify the decoded message
        assertEquals(1000, dealRequestDecoder.amount().mantissa());
        assertEquals(2, dealRequestDecoder.amount().exponent());
        assertEquals("USD", dealRequestDecoder.currency());
        assertEquals("BUY", dealRequestDecoder.side());
        assertEquals("EURUSD", dealRequestDecoder.symbol());
        assertEquals("20240201", dealRequestDecoder.deliveryDate());
        assertEquals("20240101-00:00:00.000", dealRequestDecoder.transactTime());
        assertEquals("QR123456", dealRequestDecoder.quoteRequestID());
        assertEquals("Q123456", dealRequestDecoder.quoteID());
        assertEquals("DR123456", dealRequestDecoder.dealRequestID());
        assertEquals(100, dealRequestDecoder.fxRate().mantissa());
        assertEquals(-2, dealRequestDecoder.fxRate().exponent());

        context.close();
        log.info("Out testDealRequest");
    }
}
