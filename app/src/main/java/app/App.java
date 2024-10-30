package app;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.core.config.Configurator;

import aeron.AeronClient;
import aeron.AeronErrorClient;
import backend.ProcessUtil;
import backend.WebSocketServer;
import config.AeronConfiguration;
import config.MeterConfiguration;
import io.aeron.Aeron;
import io.micrometer.core.instrument.MeterRegistry;
import persistence.ClientDbInitializer;
import persistence.SqlPersistor;

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
    private static AppConfig appConfig;

    private static String clientDbURL;
    public static String getClientDbURL() {return clientDbURL; }

    private static volatile boolean running;
    private void setRunning(boolean b) { running = b; }
    public static boolean getRunning() { return running; }

    private static void initializeLogging() {
        // Uses system out as logger may not be initialised
        System.out.println("Working Directory: " + System.getProperty("user.dir"));
        System.out.println("Log4j2 initialized: " + LogManager.getContext(false).hasLogger(App.class.getName()));

        String configFilePath = System.getProperty("log4j.configurationFile");
        if (configFilePath == null) {
            configFilePath = "src/main/resources/log4j2.xml";
            System.setProperty("log4j.configurationFile", configFilePath);
        }
        Configurator.initialize(null, configFilePath);
        log.info("Log4j2 initialized with configuration file: {}", configFilePath);
    }

    public static void main(String[] args) {
        // Initialize configuration
        appConfig = new AppConfig();

        initializeLogging();

        startApp();
    }

    public static void startApp() {
        log.info("Application PID: {}", ProcessUtil.getProcessId());

        // Get the properties
        String aeronDirectory = appConfig.getProperty("aeron.directory");
        if (aeronDirectory == null || aeronDirectory.isEmpty()) {
            log.error("Property 'aeron.directory' not set");
            throw new RuntimeException("Property 'aeron.directory' required");
        }

        clientDbURL = appConfig.getProperty("sqlite.client.url");
        if (clientDbURL == null || clientDbURL.isEmpty()) {
            log.error("Property 'sqlite.client.url' not set");
            throw new RuntimeException("Property 'sqlite.client.url' required");
        }

        webSocketPort = Integer.parseInt(appConfig.getProperty("websocket.port"));
        log.info("Websocket port: " + webSocketPort);

        // Start environment
        App appInstance = new App();
	    appInstance.StartWebsocket(webSocketPort);
        appInstance.startAeronEnvironment(aeronDirectory);
        appInstance.startDBEnvironment(clientDbURL);
        appInstance.setRunning(true);

        log.info("Application started up");
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

	public void startAeronEnvironment(String dirName) {
		// Use AeronConfiguration to create dependencies
		log.info("Start Aeron client");

		Aeron aeron = aeronConfiguration.createAeron(dirName);
		MeterRegistry registry = meterConfiguration.createMeterRegistry();

		// Create Aeron client instances with injected dependencies
		aeronClient = new AeronClient();
        aeronClient.start(aeron, registry);

        aeronErrorClient = new AeronErrorClient();
        aeronErrorClient.start(aeron, registry);
	}

    private void startDBEnvironment(String URL) {
		log.info("Start SqLite at {}", URL);
		ClientDbInitializer.initializeDatabase(URL);

        new SqlPersistor().start();
    }

	public void stopAeronEnvironment() {
        if (aeronClient != null) {
            aeronClient.close();
        }

		// The aeron media driver works independently of aeron pub sub
		aeronConfiguration.closeAeron();
	}
}
