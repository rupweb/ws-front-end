package websockets;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class WebSocketTest {
    private static final Logger log = LogManager.getLogger(WebSocketTest.class);

    private WebSocketClient client;
    private CountDownLatch latch;

    @BeforeEach
    public void setUp() throws URISyntaxException, InterruptedException {
        log.info("In setUp");

        latch = new CountDownLatch(1);

        client = new WebSocketClient(new URI("ws://localhost:8090/ws")) {
            @Override
            public void onOpen(ServerHandshake handshakedata) {
                log.info("WebSocket connection opened");
            }

            @Override
            public void onMessage(String message) {
                log.info("Received message: " + message);
                if (message.equals("Echo: Hello")) {
                    latch.countDown();
                }
            }

            @Override
            public void onClose(int code, String reason, boolean remote) {
                log.info("WebSocket connection closed");
            }

            @Override
            public void onError(Exception ex) {
                ex.printStackTrace();
            }
        };

        assertTrue(client.connectBlocking(), "Client is not connected");

        log.info("Out setUp");
    }

    @AfterEach
    public void tearDown() {
        log.info("In tearDown");
        if (client != null) {
            client.close();
        }
    }

    @Test
    public void testWebSocketConnection() throws InterruptedException {
        log.info("In testWebSocketConnection");

        client.send("Hello");

        boolean messageReceived = latch.await(5, TimeUnit.SECONDS);
        assertTrue(messageReceived, "Did not receive expected message");

        log.info("Out testWebSocketConnection");
    }
}
