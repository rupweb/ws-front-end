package setup;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import config.TestMediaDriver;
import app.App;

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

            // Start the aeron pubsub and the FIX engine in a virtual thread
            Thread.startVirtualThread(() -> {
                App.main(null);
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
