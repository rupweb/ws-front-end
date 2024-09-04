package backend;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.core.config.Configurator;

import com.fasterxml.jackson.databind.ser.std.SqlDateSerializer;

import io.aeron.Aeron;
import io.aeron.driver.MediaDriver;
import persistence.SqLiteInitializer;
import persistence.SqlPersistor;

public class App {
    private static final Logger log = LogManager.getLogger(App.class);
    private static AeronClient aeronClient;
    public static AeronClient getAeronClient() { return aeronClient; }

    private static AeronErrorClient aeronErrorClient;
    public static AeronErrorClient getAeronErrorClient() { return aeronErrorClient; }

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

        // Create the AeronMonitor instances with injected dependencies
        aeronErrorClient = new AeronErrorClient(aeron);
        aeronClient = new AeronClient(aeron);

        // Start Error client in a new thread
        new Thread(() -> {
            try {
                aeronErrorClient.start();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();

        // Start database persistence
        SqLiteInitializer.initializeDatabase();
        new SqlPersistor().start();

        // Start the main aeron client
        aeronClient.start();

        log.debug("Out App main");
    }
}
