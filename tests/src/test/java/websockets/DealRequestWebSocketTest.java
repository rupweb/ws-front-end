package websockets;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Value;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.junit.jupiter.api.AfterEach;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import utils.Utils;

public class DealRequestWebSocketTest {
    private static final Logger log = LogManager.getLogger(DealRequestWebSocketTest.class);

    private WebSocketClient client;
    private CountDownLatch latch;
    private Context context;

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

    @BeforeEach
    public void setUp() throws IOException {
        log.info("In setUp");

        // Initialize a new CountDownLatch for each test
        latch = new CountDownLatch(1);

        // Ensure the server is running and reachable
        connectToWebSocket();

        // Setup GraalVM context
        context = Context.newBuilder("js")
                .allowAllAccess(true)
                .build();

        // Load and prepare scripts
        String textEncoderScript = Utils.loadScript("tests/src/test/java/aeron/TextEncoder.js");
        String decimalEncoderScript = Utils.convertES6ToCommonJS(Utils.loadScript("frontend/src/aeron/js/DecimalEncoder.js"));
        String messageHeaderEncoderScript = Utils.convertES6ToCommonJS(Utils.loadScript("frontend/src/aeron/js/MessageHeaderEncoder.js"));
        String dealRequestEncoderScript = Utils.convertES6ToCommonJS(Utils.loadScript("frontend/src/aeron/js/DealRequestEncoder.js"));
        String encodeDealRequestScript = Utils.removeJSImportExport(Utils.loadScript("frontend/src/messages/encodeDealRequest.js"));

        // Concatenate scripts in the correct order
        String combinedScript = textEncoderScript + "\n" +
                                decimalEncoderScript + "\n" +
                                messageHeaderEncoderScript + "\n" +
                                dealRequestEncoderScript + "\n" +
                                encodeDealRequestScript;

        // Evaluate the combined script
        context.eval("js", combinedScript);

        log.info("Out setUp");
    }

    @AfterEach
    public void tearDown() {
        log.info("In tearDown");

        if (client != null) {
            client.close();
        }
        if (context != null) {
            context.close();
        }
    }

    private void connectToWebSocket() {
        try {
            client = new WebSocketClient(new URI("ws://localhost:8092/ws")) {
                @Override
                public void onOpen(ServerHandshake handshakedata) {
                    System.out.println("WebSocket connection opened");
                }

                @Override
                public void onMessage(String message) {
                    System.out.println("Received message: " + message);
                    // Add logic to handle the received SBE message
                    latch.countDown();
                }

                @Override
                public void onClose(int code, String reason, boolean remote) {
                    System.out.println("WebSocket connection closed");
                }

                @Override
                public void onError(Exception ex) {
                    ex.printStackTrace();
                }
            };

            if (!client.connectBlocking()) {
                log.warn("Client failed to connect in setUp");
            }

        } catch (URISyntaxException | InterruptedException e) {
            log.error("Error while connecting to WebSocket", e);
        }
    }

    @Test
    public void testDealRequest() throws InterruptedException, JsonProcessingException {
        log.info("In testDealRequest");

        if (!client.isOpen()) {
            log.warn("Client is not connected");
            return;
        }
        
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

        // Send the encoded message via WebSocket
        client.send(encodedMessage);

        boolean messageReceived = latch.await(5, TimeUnit.SECONDS);
        assertTrue(messageReceived, "Did not receive expected message");

        // Add additional assertions to verify the received message

        log.info("Out testDealRequest");
    }
}
