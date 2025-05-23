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

import agrona.messages.MessageHeaderDecoder;
import agrona.messages.QuoteRequestDecoder;
import utils.Utils;

public class QuoteRequestTest {
    private static final Logger log = LogManager.getLogger(QuoteRequestTest.class);

    // Define quote request data
    double amount;
    String saleCurrency;
    String currencyOwned; 
    String side;
    String symbol;
    String deliveryDate;
    String transactTime; 
    String quoteRequestID;
    String clientID;

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
        String decimalEncoderScript = Utils.convertES6ToCommonJS(Utils.loadScript("frontend/src/aeron/v1/DecimalEncoder.js"));
        String messageHeaderEncoderScript = Utils.convertES6ToCommonJS(Utils.loadScript("frontend/src/aeron/MessageHeaderEncoder.js"));
        String quoteRequestEncoderScript = Utils.convertES6ToCommonJS(Utils.loadScript("frontend/src/aeron/v1/QuoteRequestEncoder.js"));
        String encodeQuoteRequestScript = Utils.removeJSImportExport(Utils.loadScript("frontend/src/messages/encodeQuoteRequest.js"));

        // Concatenate scripts in the correct order
        String combinedScript = textEncoderScript + "\n" +
                                decimalEncoderScript + "\n" +
                                messageHeaderEncoderScript + "\n" +
                                quoteRequestEncoderScript + "\n" +
                                encodeQuoteRequestScript;

        // Evaluate the combined script
        context.eval("js", combinedScript);

        // Create a random GUID
        UUID uuid = UUID.randomUUID();
        String guid = uuid.toString().substring(0, 8).toUpperCase();

        // Populate quote request data
        amount = 1000;
        saleCurrency = "USD";
        currencyOwned = "EUR";
        side = "BUY";
        symbol = "EURUSD";
        deliveryDate = "20250101";
        transactTime = "20240101-00:00:00.000";   
        quoteRequestID = guid;
        clientID = "TEST";

        // Use Jackson JSON mapping
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> data = new HashMap<>();
        data.put("amount", Map.of("mantissa", (int) (amount * 100), "exponent", -2));
        data.put("saleCurrency", saleCurrency);
        data.put("currencyOwned", currencyOwned);
        data.put("side", side);
        data.put("symbol", symbol);
        data.put("deliveryDate", deliveryDate);
        data.put("transactTime", transactTime);
        data.put("quoteRequestID", quoteRequestID);
        data.put("clientID", clientID);

        // Convert map to JSON string
        String dataScript = "const data = " + mapper.writeValueAsString(data) + ";";

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
        QuoteRequestDecoder decoder = new QuoteRequestDecoder();
        MessageHeaderDecoder headerDecoder = new MessageHeaderDecoder();

        headerDecoder.wrap(buffer, 0);
        decoder.wrapAndApplyHeader(buffer, 0, headerDecoder);

        // Verify the decoded message
        assertEquals((long) (amount * 100), decoder.amount().mantissa());
        assertEquals(-2, decoder.amount().exponent());
        assertEquals(saleCurrency, decoder.saleCurrency());
        assertEquals(currencyOwned, decoder.currencyOwned());
        assertEquals(side, decoder.side());
        assertEquals(symbol, decoder.symbol());
        assertEquals(deliveryDate, decoder.deliveryDate());
        assertEquals(transactTime, decoder.transactTime());
        assertEquals(quoteRequestID, decoder.quoteRequestID());
        assertEquals(clientID, decoder.clientID());

        log.info("Received and verified quote request message");

        context.close();
        log.info("Out testQuoteRequest");
    }      
}
