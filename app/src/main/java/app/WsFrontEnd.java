package app;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class WsFrontEnd {
    public static void main(String[] args) {
        Properties initialProperties = loadInitialProperties();
        LogConfig.initialize(initialProperties);

        // Initialize properties
        AppConfig appConfig = new AppConfig();

        new App().startApp(appConfig);
    }

    private static Properties loadInitialProperties() {
        Properties properties = new Properties();
        try (InputStream input = getClassLoaderResourceAsStream("application.properties")) {
            if (input != null) {
                properties.load(input);
            }
        } catch (IOException e) {
            System.err.println("Failed to load initial properties. Default logging will be used.");
        }
        return properties;
    }

    // Get inputstream without hardcoding class name
    private static InputStream getClassLoaderResourceAsStream(String resourceName) {
        Class<?> currentClass = new Object() {}.getClass().getEnclosingClass();
        return currentClass.getClassLoader().getResourceAsStream(resourceName);
    }

}
