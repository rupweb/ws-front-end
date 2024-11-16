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
    private final Properties properties = new Properties();
    private String propertiesFile;
    
    public AppConfig(String propertiesFile) {
        System.out.println("Loading AppConfig properties file: " + propertiesFile);
        this.propertiesFile = propertiesFile;
        loadProperties();
        logProperties();
    }

    private void loadProperties() {
        System.out.println("About to write the first log message");
		log.info("Working Directory: {}", System.getProperty("user.dir"));
        log.info("Loading properties from {}", propertiesFile);

        try {
            // Load the main application.properties file
            Properties mainProperties = loadPropertiesFile(propertiesFile);
            properties.putAll(mainProperties);

            // Check for config.import directive
            String importFilePath = properties.getProperty("config.import");
            if (importFilePath != null && !importFilePath.isEmpty()) {

                // Use relative path
                Path basePath = Paths.get(propertiesFile).getParent();
                if (basePath == null) { basePath = Paths.get(""); }
                Path importPath = basePath.resolve(importFilePath).normalize();

                Properties importProperties = loadPropertiesFile(importPath.toString());
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
    
        File file = new File(filePath);
        if (file.exists() && file.isFile()) {
            // Load properties from an absolute file path
            log.info("Load properties from absolute path: {}", file.getAbsolutePath());
            try (InputStream input = new FileInputStream(file)) {
                prop.load(input);
            }
        } else {
            // Fallback to loading from classpath
            log.info("Load properties from classpath: {}", filePath);
            try (InputStream input = getClass().getClassLoader().getResourceAsStream(filePath)) {
                if (input == null) {
                    throw new IOException("Property file '" + filePath + "' not found in the classpath");
                }
                prop.load(input);
            }
        }
        return prop;
    }    

    public void loadTestProperties(String filePath) {
        try (InputStream input = new FileInputStream(filePath)) {
            properties.load(input);
            log.info("Loaded test-specific properties from: {}", filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load test properties", e);
        }
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

    public Integer getIntProperty(String key) {
        String value = getProperty(key);
        if (value == null) {
            return null;
        }
        return Integer.valueOf(value);
    }    

    public Properties getProperties() {
        return properties;
    }
}
