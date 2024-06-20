package backend;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.core.config.Configurator;

public class App {
    private static final Logger log = LogManager.getLogger(App.class);

    static {
        System.out.println("Log4j2 initialized: " + LogManager.getContext(false).hasLogger(App.class.getName()));
        System.out.println("Working Directory: " + System.getProperty("user.dir"));
        System.out.println("Log4j2 Configuration File: " + System.getProperty("log4j.configurationFile"));
        Configurator.initialize(null, System.getProperty("log4j.configurationFile"));
    }

    public static void main(String[] args) throws InterruptedException {
        log.info("In App main");

        int webSocketPort = 8090; // Default WebSocket port

        WebSocketServer webSocketServer = new WebSocketServer(webSocketPort);
        AeronClient aeronClient = new AeronClient();

        // Start WebSocket server in a new thread
        new Thread(() -> {
            try {
                webSocketServer.start();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();

        // Start Aeron client
        aeronClient.start();

        log.info("Out App main");
    }
}
