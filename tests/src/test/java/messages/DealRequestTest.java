package messages;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.agrona.concurrent.UnsafeBuffer;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Value;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.ObjectMapper;

import agrona.messages.DealRequestDecoder;
import agrona.messages.MessageHeaderDecoder;
import utils.Utils;

public class DealRequestTest {
    private static final Logger log = LogManager.getLogger(DealRequestTest.class);

    // Define deal request variables
    double amount;
    String currency;
    String side;
    String symbol;
    String deliveryDate;
    String transactTime;
    String quoteID;     
    String quoteRequestID; 
    String dealRequestID;
    String clientID;
    double fxRate;
    double secondaryAmount;

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
        String decimalEncoderScript = Utils.convertES6ToCommonJS(Utils.loadScript("frontend/src/aeron/js/DecimalEncoder.js"));
        String messageHeaderEncoderScript = Utils.convertES6ToCommonJS(Utils.loadScript("frontend/src/aeron/js/MessageHeaderEncoder.js"));
        String dealRequestEncoderScript = Utils.convertES6ToCommonJS(Utils.loadScript("frontend/src/aeron/js/DealRequestEncoder.js"));
        String encodeDealRequestScript = Utils.removeJSImportExport(Utils.loadScript("frontend/src/messages/encodeDealRequest.js"));

        log.debug("\n{}", encodeDealRequestScript);

        // Concatenate scripts in the correct order
        String combinedScript = textEncoderScript + "\n" +
                                decimalEncoderScript + "\n" +
                                messageHeaderEncoderScript + "\n" +
                                dealRequestEncoderScript + "\n" +
                                encodeDealRequestScript;

        // Evaluate the combined script
        context.eval("js", combinedScript);

        // Create a random GUID
        UUID uuid = UUID.randomUUID();
        String guid = uuid.toString().substring(0, 8).toUpperCase();

        // Define deal request data
        amount = 1000;
        currency = "USD";
        side = "BUY";
        symbol = "EURUSD";
        deliveryDate = "20250101";
        transactTime = "20240101-00:00:00.000";
        quoteID = guid;     
        quoteRequestID = guid;   
        dealRequestID = guid;
        clientID = "TEST";
        fxRate = 1.23456;
        secondaryAmount = 810.01;

        // Use Jackson JSON mapping
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> data = new HashMap<>();
        data.put("amount", Map.of("mantissa", (int) (amount * 100), "exponent", -2));
        data.put("currency", currency);
        data.put("side", side);
        data.put("symbol", symbol);
        data.put("deliveryDate", deliveryDate);
        data.put("transactTime", transactTime);
        data.put("quoteRequestID", quoteRequestID);
        data.put("quoteID", quoteID);
        data.put("dealRequestID", dealRequestID);
        data.put("fxRate", Map.of("mantissa", (int) (fxRate * 100000), "exponent", -5));
        data.put("clientID", clientID);
        data.put("secondaryAmount", Map.of("mantissa", (int) (secondaryAmount * 100), "exponent", -2));

        // Convert map to JSON string
        String dataScript = "const data = " + mapper.writeValueAsString(data) + ";";

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
        DealRequestDecoder decoder = new DealRequestDecoder();
        MessageHeaderDecoder headerDecoder = new MessageHeaderDecoder();

        headerDecoder.wrap(buffer, 0);
        decoder.wrapAndApplyHeader(buffer, 0, headerDecoder);

        // Verify the decoded message
        assertEquals((long) (amount * 100), decoder.amount().mantissa());
        assertEquals(-2, decoder.amount().exponent());
        assertEquals(currency, decoder.currency());
        assertEquals((long) (secondaryAmount * 100), decoder.secondaryAmount().mantissa());
        assertEquals(-2, decoder.secondaryAmount().exponent());
        assertEquals(side, decoder.side());
        assertEquals(symbol, decoder.symbol());
        assertEquals(deliveryDate, decoder.deliveryDate());
        assertEquals(transactTime, decoder.transactTime());
        assertEquals(quoteRequestID, decoder.quoteRequestID());
        assertEquals(quoteID, decoder.quoteID());
        assertEquals(dealRequestID, decoder.dealRequestID());
        assertEquals((long) (fxRate * 100000), decoder.fxRate().mantissa());
        assertEquals(-5, decoder.fxRate().exponent());
        assertEquals(clientID, decoder.clientID());

        log.info("Received and verified deal request message");

        context.close();
        log.info("Out testDealRequest");
    }
}
