package websockets;

import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Source;
import org.graalvm.polyglot.Value;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class DealRequestWebSocketTest {
    private static final Logger log = LogManager.getLogger(DealRequestWebSocketTest.class);

    private WebSocketClient client;
    private CountDownLatch latch;
    private Context context;

    @BeforeEach
    public void setUp() throws URISyntaxException, IOException {
        log.info("In setUp");

        latch = new CountDownLatch(1);

        client = new WebSocketClient(new URI("ws://localhost:8090/ws")) {
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

        client.connect();

        // Setup GraalVM context
        context = Context.newBuilder("js")
                .allowAllAccess(true)
                .build();

        // Load JavaScript files for encoding
        String encodeDealRequest = new String(Files.readAllBytes(Paths.get("../frontend/src/messages/encodeDealRequest.js")));
        context.eval(Source.newBuilder("js", encodeDealRequest, "encodeDealRequest.js").build());

        log.info("Out setUp");
    }

    @AfterEach
    public void tearDown() {
        log.info("In tearDown");

        client.close();
        context.close();
    }

    @Test
    public void testDealRequest() throws InterruptedException {
        log.info("In testDealRequest");

        assertTrue(client.isOpen() || client.connectBlocking(), "Client is not connected");

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

        // Send the encoded message via WebSocket
        client.send(encodedMessage);

        boolean messageReceived = latch.await(5, TimeUnit.SECONDS);
        assertTrue(messageReceived, "Did not receive expected message");

        // Add additional assertions to verify the received message

        log.info("Out testDealRequest");
    }
}
