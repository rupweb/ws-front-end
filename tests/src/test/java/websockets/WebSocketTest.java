package websockets;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.junit.jupiter.api.AfterEach;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class WebSocketTest {
    private static final Logger log = LogManager.getLogger(WebSocketTest.class);

    private WebSocketClient client;
    private CountDownLatch latch;

    @BeforeEach
    public void setUp() {
        log.info("In setUp");
        // Initialize a new CountDownLatch for each test
        latch = new CountDownLatch(1);

        // Ensure the server is running and reachable
        connectToWebSocket();

        log.info("Out setUp");
    }

    @AfterEach
    public void tearDown() {
        log.info("In tearDown");
        if (client != null) {
            client.close();
        }
    }

    private void connectToWebSocket() {
        try {
            client = new WebSocketClient(new URI("ws://localhost:8092/ws")) {
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
                    log.error("Error occurred:", ex);
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
    public void testWebSocketConnection() throws InterruptedException {
        log.info("In testWebSocketConnection");

        if (!client.isOpen()) {
            log.warn("Client is not connected");
            return;
        }

        client.send("Hello");

        boolean messageReceived = latch.await(5, TimeUnit.SECONDS);
        assertTrue(messageReceived, "Did not receive expected message");

        log.info("Out testWebSocketConnection");
    }
}
