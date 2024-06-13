package backend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class App {
    private static final Logger logger = LoggerFactory.getLogger(App.class);

    public static void main(String[] args) throws InterruptedException {
        logger.info("In App main");

        int webSocketPort = 8081; // Default WebSocket port

        WebSocketServer webSocketServer = new WebSocketServer(webSocketPort);
        AeronServer aeronServer = new AeronServer();

        // Start WebSocket server in a new thread
        new Thread(() -> {
            try {
                webSocketServer.start();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();

        // Start Aeron server
        aeronServer.start();

        logger.info("Out App main");
    }
}
