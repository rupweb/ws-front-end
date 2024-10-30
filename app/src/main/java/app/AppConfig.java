package app;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class AppConfig {
    private static final Logger log = LogManager.getLogger(AppConfig.class);

    private Properties properties = new Properties();
    private String propertiesFile;

    public AppConfig() {
        this("application.properties");
    }

    public AppConfig(String propertiesFile) {
        this.propertiesFile = propertiesFile;
        loadProperties();
    }

    private void loadProperties() {
        log.info("Loading properties from {}", propertiesFile);

        try {
            // Load the main application.properties file
            Properties mainProperties = loadPropertiesFile(propertiesFile);
            properties.putAll(mainProperties);

            // Check for config.import directive
            String importFilePath = properties.getProperty("config.import");
            if (importFilePath != null && !importFilePath.isEmpty()) {
                Properties importProperties = loadPropertiesFile(importFilePath);
                properties.putAll(importProperties);
            }
        } catch (IOException e) {
            log.error(e.getMessage());
            throw new RuntimeException("Failed to load properties files", e);
        }

        // Log the properties
        log.info("-----------------------");
        properties.forEach((key, value) -> log.info("{}: {}", key, value));
        log.info("-----------------------");
        log.info("");
    }

    private Properties loadPropertiesFile(String filePath) throws IOException {
        Properties prop = new Properties();
        try (InputStream input = getClass().getClassLoader().getResourceAsStream(filePath)) {
            if (input == null) {
                throw new IOException("Property file '" + filePath + "' not found in the classpath");
            }
            prop.load(input);
        }
        return prop;
    }

    public String getProperty(String key) {
        return properties.getProperty(key);
    }

    public Properties getProperties() {
        return properties;
    }
}

