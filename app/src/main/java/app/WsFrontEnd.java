package app;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class WsFrontEnd {
    public static void main(String[] args) {
        System.out.println("In main");

        // Get properties file from system property depending on environment
        String propertiesFile = System.getProperty("app.config.file", "application.properties");
        Properties initialProperties = loadInitialProperties(propertiesFile);
        LogConfig.initialize(initialProperties);

        // Initialize properties
        AppConfig appConfig = new AppConfig(propertiesFile);

        System.out.println("Starting application");
        new App().startApp(appConfig);

        System.out.println("Out main");
    }

    private static Properties loadInitialProperties(String fileName) {
        System.out.println("Properties file: " + fileName);

        Properties properties = new Properties();
        try (InputStream input = getClassLoaderResourceAsStream(fileName)) {
            if (input != null) {
                properties.load(input);
                System.out.println("Loaded properties:");
                for (String key : properties.stringPropertyNames()) {
                    System.out.println(key + " = " + properties.getProperty(key));
                }
            } else {
                System.out.println("No properties file found: " + fileName);
            }
        } catch (IOException e) {
            System.err.println("Failed to load initial properties. Default logging will be used.");
        }
        return properties;
    }

    // Get inputstream without hardcoding class name
    private static InputStream getClassLoaderResourceAsStream(String resourceName) {
        Class<?> currentClass = new Object() {}.getClass().getEnclosingClass();
        System.out.println("Current class: " + currentClass.getName());
        return currentClass.getClassLoader().getResourceAsStream(resourceName);
    }
}
