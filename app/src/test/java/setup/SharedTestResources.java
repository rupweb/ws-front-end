package setup;

import java.nio.file.Paths;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import app.App;
import app.WsFrontEnd;
import config.TestMediaDriver;

public class SharedTestResources {
    private static final Logger log = LogManager.getLogger(SharedTestResources.class);

    TestMediaDriver testMediaDriver = new TestMediaDriver();

    private App app;
    public App getAppMonitor() { return app; }

    private static boolean initialized = false;

    public synchronized void initialize() {
        log.info("In SharedTestResources initialize");

        if (!initialized) {
            // Initialize the test media driver here, before any test runs
            log.info("Initializing test media driver");
            if (testMediaDriver != null) {
                testMediaDriver.start();
            } else {
                log.error("TestMediaDriver is null");
            }

            // Respect existing app.config.file property
            String existingConfigFile = System.getProperty("app.config.file");
            if (existingConfigFile == null || existingConfigFile.isEmpty()) {
                String testConfigPath = Paths.get("app", "src", "test", "resources", "application.properties").toAbsolutePath().toString();
                System.setProperty("app.config.file", testConfigPath);
                log.info("app.config.file: {}", testConfigPath);
            } else {
                log.info("app.config.file: {}", existingConfigFile);
            }

            // Start the aeron pubsub and the FIX engine in a virtual thread
            Thread.startVirtualThread(() -> {
                WsFrontEnd.main(null);
            });

            initialized = true;
            log.info("Shared test resources initialized.");
        }
    }

    public synchronized void close() {
        log.info("In SharedTestResources close");

        if (initialized) {
            try {
                app.stopAeronEnvironment();

                if (testMediaDriver != null) {
                    testMediaDriver.stop();
                }                
            } catch (Exception e) {
                log.warn("Resources shut down interrupted");
            }
            initialized = false;
            log.info("Shared test resources closed.");
        }
    }
}
