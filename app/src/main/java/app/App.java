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
import messages.admin.Admin;
import sharedJava.AppConfig;
import sharedJava.utils.ProcessUtil;

public class App {
    private static final Logger log = LogManager.getLogger(App.class);

    private static AeronClient aeronClient;
    public static AeronClient getAeronClient() { return aeronClient; }

    private static AeronErrorClient aeronErrorClient;
    public static AeronErrorClient getAeronErrorClient() { return aeronErrorClient; }

    private static int webSocketPort;
    public static int getWebSocketPort() { return webSocketPort; }

    private final AeronConfiguration aeronConfiguration = new AeronConfiguration();
    private final MeterConfiguration meterConfiguration = new MeterConfiguration();

    private static volatile boolean running;
    private static volatile boolean shutdownStarted;
    private void setRunning(boolean b) { running = b; }
    public static boolean getRunning() { return running; }

    private static String clientDbURL;
    public static String getClientDbURL() { return clientDbURL; }

    public void startApp(AppConfig appConfig) {
        log.info("Application PID: {}", ProcessUtil.getProcessId());

        String aeronDirectory = getRequiredProperty(appConfig, "aeron.directory");
        clientDbURL = getRequiredProperty(appConfig, "sqlite.client.url");
        webSocketPort = Integer.parseInt(appConfig.getProperty("websocket.port"));
        log.info("Websocket port: {}", webSocketPort);

        startWebsocket(webSocketPort);
        startAeronEnvironment(aeronDirectory, appConfig);
        setRunning(true);

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            log.info("App shutdown hook triggered. Stopping application...");
            stopApp();
        }));

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

    private void startWebsocket(int webSocketPort) {
        WebSocketServer webSocketServer = new WebSocketServer(webSocketPort);

        new Thread(() -> {
            try {
                webSocketServer.start();
            } catch (InterruptedException e) {
                log.error(e.getMessage());
            }
        }).start();
    }

    public void startAeronEnvironment(String dirName, AppConfig config) {
        log.info("Start Aeron client");

        Aeron aeron = aeronConfiguration.createAeron(dirName);
        MeterRegistry registry = meterConfiguration.createMeterRegistry();

        aeronClient = new AeronClient(config);
        aeronClient.start(aeron, registry);

        aeronErrorClient = new AeronErrorClient(config);
        aeronErrorClient.start(aeron, registry);

        System.setProperty("application.name", config.getProperty("application.name"));

        Admin admin = ProcessUtil.getAdminMessage("START", "");
        App.getAeronClient().getAdminSender().sendAdmin(admin);
    }

    public void stopAeronEnvironment() {
        Admin admin = ProcessUtil.getAdminMessage("STOP", "");
        App.getAeronClient().getAdminSender().sendAdmin(admin);

        if (aeronClient != null) {
            aeronClient.stop();
        }

        if (aeronErrorClient != null) {
            aeronErrorClient.stop();
        }

        aeronConfiguration.closeAeron();
    }

    public synchronized void stopApp() {
        if (shutdownStarted) {
            log.info("Shutdown already in progress.");
            return;
        }
        shutdownStarted = true;

        setRunning(false);
        stopAeronEnvironment();
    }
}
