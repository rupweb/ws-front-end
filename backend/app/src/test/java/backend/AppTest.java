package backend;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.core.config.Configurator;
import org.apache.logging.log4j.status.StatusLogger;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class AppTest {
    private static final Logger log = LogManager.getLogger(AppTest.class);

    @BeforeAll
    static void setup() {
        System.setProperty("log4j.configurationFile", "src/test/resources/log4j2.xml");
        Configurator.initialize(null, "src/test/resources/log4j2.xml");
        System.out.println("Log4j2 test initialized: " + LogManager.getContext(false).hasLogger(AppTest.class.getName()));
        System.out.println("Test Working Directory: " + System.getProperty("user.dir"));
        System.out.println("Log4j2 Configuration File: " + System.getProperty("log4j.configurationFile"));
    }


    @Test 
    public void testApp() {
        System.out.println("Starting test app");
        log.info("Starting test app");

        App classUnderTest = new App();
        assertNotNull(classUnderTest);

        log.info("Finished test app");
        System.out.println("Finished test app");
    }
}
