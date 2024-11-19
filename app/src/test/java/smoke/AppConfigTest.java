package smoke;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import sharedJava.AppConfig;

public class AppConfigTest {

    private AppConfig appConfig;

    @BeforeEach
    public void setUp() {
        // Initialize AppConfig with the test properties file
        appConfig = new AppConfig("application.properties");
    }

    @Test
    public void testPropertiesNotNull() {
        // Verify that the properties object is not null
        assertNotNull(appConfig.getProperties(), "Properties should not be null");
    }

    @Test
    public void testMainPropertyLoaded() {
        // Verify a property from application.properties is loaded
        String applicationName = appConfig.getProperty("application.name");
        assertEquals("ws-front-end-app-test", applicationName, "Application name should be 'ws-front-end-app-test'");
    }

    @Test
    public void testImportedPropertyLoaded() {
        // Verify a property from the imported properties file is loaded
        String aeronDirectory = appConfig.getProperty("aeron.directory");
        assertEquals("/tmp/ws-test", aeronDirectory, "Aeron directory should be '/tmp/ws-test'");
    }

    @Test
    public void testPropertyOverride() {
        // Verify that imported properties override main properties if they overlap
        String currentEnvironment = appConfig.getProperty("current.environment");
        assertEquals("TEST", currentEnvironment, "Current environment should be 'TEST'");
    }

    @Test
    public void testNonExistentProperty() {
        // Verify that requesting a non-existent property returns null
        String nonExistent = appConfig.getProperty("non.existent.property");
        assertNull(nonExistent, "Non-existent property should return null");
    }
}

