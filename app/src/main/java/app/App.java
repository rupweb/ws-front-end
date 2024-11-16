package app;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import aeron.AeronClient;
import aeron.AeronErrorClient;
import backend.WebSocketServer;
import config.AeronConfiguration;
import config.MeterConfiguration;
import io.aeron.Aeron;
import io.micrometer.core.instrument.MeterRegistry;
import persistence.ClientDbInitializer;
import persistence.SqlPersistor;
import utils.ProcessUtil;

public class App {
    private static final Logger log = LogManager.getLogger(App.class);

    private static AeronClient aeronClient;
    public static AeronClient getAeronClient() { return aeronClient; }

    private static AeronErrorClient aeronErrorClient;
    public static AeronErrorClient getAeronErrorClient() { return aeronErrorClient; }

    private static int webSocketPort;
    public static int getWebSocketPort() { return webSocketPort; }

    private AeronConfiguration aeronConfiguration = new AeronConfiguration();
    private MeterConfiguration meterConfiguration = new MeterConfiguration();

    private static volatile boolean running;
    private void setRunning(boolean b) { running = b; }
    public static boolean getRunning() { return running; }

    private static String clientDbURL;
    public static String getClientDbURL() {return clientDbURL; }

    public void startApp(AppConfig appConfig) {
        log.info("Application PID: {}", ProcessUtil.getProcessId());

        // Check required properties
        String aeronDirectory = getRequiredProperty(appConfig, "aeron.directory");
        clientDbURL = getRequiredProperty(appConfig, "sqlite.client.url");
        webSocketPort = Integer.parseInt(appConfig.getProperty("websocket.port"));
        log.info("Websocket port: {}", webSocketPort);

        // Start Aeron environment
	    StartWebsocket(webSocketPort);
        startAeronEnvironment(aeronDirectory, appConfig);
        startDBEnvironment(clientDbURL);
        setRunning(true);

        log.info("Application started up");
    }

    private String getRequiredProperty(AppConfig appConfig, String propertyName) {
        String value = appConfig.getProperty(propertyName);
        if (value == null || value.isEmpty()) {
            log.error("Property '{}' not set", propertyName);
            throw new RuntimeException("Property '" + propertyName + "' required");
        }
        return value;
    }

    private void StartWebsocket(int webSocketPort) {
        WebSocketServer webSocketServer = new WebSocketServer(webSocketPort);

        // Start WebSocket server in a new thread
        new Thread(() -> {
            try {
                webSocketServer.start();
            } catch (InterruptedException e) {
                log.error(e.getMessage());
            }
        }).start();   
    }

	public void startAeronEnvironment(String dirName, AppConfig config) {
		// Use AeronConfiguration to create dependencies
		log.info("Start Aeron client");

		Aeron aeron = aeronConfiguration.createAeron(dirName);
		MeterRegistry registry = meterConfiguration.createMeterRegistry();

		// Create Aeron client instances with injected dependencies
		aeronClient = new AeronClient(config);
        aeronClient.start(aeron, registry);

		aeronErrorClient = new AeronErrorClient(config);
        aeronErrorClient.start(aeron, registry);

        messages.Admin admin = ProcessUtil.getAdminMessage("START", "");
        App.getAeronClient().getAdminSender().sendAdmin(admin);
	}

    private void startDBEnvironment(String URL) {
		log.info("Start SqLite at {}", URL);
		ClientDbInitializer.initializeDatabase(URL);

        new SqlPersistor().start();
    }

	public void stopAeronEnvironment() {

        messages.Admin admin = ProcessUtil.getAdminMessage("STOP", "");
        App.getAeronClient().getAdminSender().sendAdmin(admin);

        if (aeronClient != null) {
            aeronClient.stop();
        }

        if (aeronErrorClient != null) {
            aeronErrorClient.stop();
        }

		// The aeron media driver works independently of aeron pub sub
		aeronConfiguration.closeAeron();
	}  
}
