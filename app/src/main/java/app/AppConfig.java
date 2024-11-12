package app;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class AppConfig {
    private static final Logger log = LogManager.getLogger(AppConfig.class);
    private Properties properties = new Properties();
    private String propertiesFile;

    public AppConfig() {
        System.out.println("Loading properties");
        this.propertiesFile = "application.properties";
        loadProperties();
        logProperties();
    }
    
    public AppConfig(String propertiesFile) {
        this.propertiesFile = propertiesFile;
        loadProperties();
        logProperties();
    }

    private void loadProperties() {
        System.out.println("Writing the first log message");
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
            throw new RuntimeException("Failed to load default properties file", e);
        }

        // Load external properties if specified
        String importFilePath = properties.getProperty("jar.config.import");
        if (importFilePath != null && !importFilePath.isEmpty()) {
            loadExternalProperties(importFilePath);
        } else {
            log.warn("No jar.config.import properties specified");
        }
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

    private void loadExternalProperties(String importFilePath) {
        try {
            Path jarDir = getJarDirectory();
            File externalConfig = jarDir.resolve(importFilePath).toFile();
            if (externalConfig.exists()) {
                log.info("Loading external properties from {}", externalConfig.getAbsolutePath());
                try (InputStream input = new FileInputStream(externalConfig)) {
                    Properties externalProps = new Properties();
                    externalProps.load(input);
                    properties.putAll(externalProps);
                }
            } else {
                log.warn("External properties file '{}' not found, using default properties only", externalConfig.getAbsolutePath());
            }
        } catch (IOException e) {
            log.error("Failed to load external properties file", e);
        }
    }

    public Path getJarDirectory() {
        try {
            URI jarURI = AppConfig.class.getProtectionDomain().getCodeSource().getLocation().toURI();
            Path jarPath = Paths.get(jarURI);

            if (jarPath.toString().endsWith(".jar")) {
                return jarPath.getParent();  // JAR directory
            }
            return jarPath.resolve("../../").normalize().toAbsolutePath();  // classpath execution
        } catch (Exception e) {
            throw new RuntimeException("Unable to determine JAR directory", e);
        }
    }

    private void logProperties() {
        log.info("-----------------------");
        properties.forEach((key, value) -> log.info("{}: {}", key, value));
        log.info("-----------------------");
    }

    public String getProperty(String key) {
        return properties.getProperty(key);
    }

    public Properties getProperties() {
        return properties;
    }
}
