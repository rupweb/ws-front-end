package setup;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class SetupSingleton {
  private static final Logger log = LogManager.getLogger(SetupSingleton.class);

    private static SetupSingleton instance;
    private Setup sharedSetup;

    private SetupSingleton() {
        // Private constructor
    }

    public static synchronized SetupSingleton getInstance() {
        if (instance == null) {
            instance = new SetupSingleton();
            instance.start();
            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                log.info("SetupSingleton shutdown hook");
                instance.stop();
            }));
        }
        return instance;
    }

    private void start() {
        log.info("Setup test resources");

        sharedSetup = new Setup();
        sharedSetup.start();
        try {
            sharedSetup.manageWaitingForApp(50);
        } catch (Exception e) {
            throw new RuntimeException("Failed to setup", e);
        }
    }

    private void stop() {
        log.info("Stop test suite");

        if (sharedSetup != null) {
            sharedSetup.stop();
        }
    }
}

