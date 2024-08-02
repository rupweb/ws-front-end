package backend;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.core.config.Configurator;

import io.aeron.Aeron;
import io.aeron.driver.MediaDriver;

public class App {
    private static final Logger log = LogManager.getLogger(App.class);
    private static AeronClient aeronClient;
    public static AeronClient getAeronClient() { return aeronClient; }

    static {
        System.out.println("Log4j2 initialized: " + LogManager.getContext(false).hasLogger(App.class.getName()));
        System.out.println("Working Directory: " + System.getProperty("user.dir"));
        System.out.println("Log4j2 Configuration File: " + System.getProperty("log4j.configurationFile"));
        Configurator.initialize(null, System.getProperty("log4j.configurationFile"));
    }

    public static void main(String[] args) throws InterruptedException {
        log.debug("In App main");

        int webSocketPort = 8090; // Default WebSocket port
        WebSocketServer webSocketServer = new WebSocketServer(webSocketPort);

        // Start WebSocket server in a new thread
        new Thread(() -> {
            try {
                webSocketServer.start();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();

        // Use AeronConfiguration to create dependencies
        AeronConfiguration config = new AeronConfiguration();
        MediaDriver mediaDriver = config.createMediaDriver();
        Aeron aeron = config.createAeron(mediaDriver);

        // Create the AeronMonitor instance with injected dependencies
        aeronClient = new AeronClient(aeron);
        aeronClient.start();

        log.debug("Out App main");
    }
}
