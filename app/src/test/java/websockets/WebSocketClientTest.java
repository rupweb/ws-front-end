package websockets;

import setup.Setup;
import setup.SetupSingleton;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.jupiter.api.Test;

import java.net.URI;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class WebSocketClientTest {
    private static final Logger log = LogManager.getLogger(WebSocketClientTest.class);

    @Test
    public void testWebSocketConnection() throws Exception {
        log.info("In testWebSocketConnection");

        // Setup test resources
        SetupSingleton.getInstance();

        /*
         * 1. Start the app and the websocket server thread
         * 2. Setup a client
         * 3. Run a test message
         */

        WebSocketClient webSocketClient = new WebSocketClient();
        webSocketClient.start();
        URI uri = WebSocketClient.getURI();

        // Connect to the server
        log.info("Connecting to server");
        WebSocketClientHandler handler = webSocketClient.connectToServer(uri);

        // Give the connection a second to connect
        Setup.sleepSeconds(1);

        // Send a message
        log.info("Sending message");
        String testMessage = "Hello WebSocket!";
        handler.sendMessage(testMessage);

        // Wait for the response
        String response = handler.getResponse();
        log.info("Response: {}", response);
        assertEquals("Echo: " + testMessage, response, "Expected echoed message from server");

        // Clean up
        webSocketClient.close();
    }
}

