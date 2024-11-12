package app;

import java.io.File;
import java.net.URI;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;

import org.apache.logging.log4j.core.config.Configurator;

public class LogConfig {
    private static final String LOG4J2_NAME = "log4j2.xml";

    public static void initialize(Properties properties) {

        String importPath = properties.getProperty("jar.config.import");

        if (importPath == null || importPath.isEmpty()) {
            System.out.println("No jar.config.import found. Using default logging configuration.");
            Configurator.initialize("default", LOG4J2_NAME);
            return;
        }

        Path jarDir = getJarDirectory();
        Path log4jPath = jarDir.resolve(importPath).getParent().resolve(LOG4J2_NAME);
        File log4jConfig = log4jPath.toFile();

        // Dynamically set log path
        System.setProperty("log.path", jarDir.resolve("logs").toAbsolutePath().toString());
        System.out.println("Log path set to: " + System.getProperty("log.path"));

        if (log4jConfig.exists()) {
            // Set the log4j configuration file path explicitly
            System.setProperty("log4j.configurationFile", log4jConfig.getAbsolutePath());
            System.out.println("Log4j2 configuration set to use external file: " + log4jConfig.getAbsolutePath());
        } else {
            System.out.println("External log4j2.xml not found, falling back to default configuration.");
            Configurator.initialize("default", LOG4J2_NAME);
        }
    }

    private static Path getJarDirectory() {
        try {
            URI jarURI = LogConfig.class.getProtectionDomain().getCodeSource().getLocation().toURI();
            Path jarPath = Paths.get(jarURI);

            if (jarPath.toString().endsWith(".jar")) {
                return jarPath.getParent();  // JAR directory
            }
            return jarPath.resolve("../../").normalize().toAbsolutePath();  // classpath execution
        } catch (Exception e) {
            throw new RuntimeException("Unable to determine JAR directory", e);
        }
    }
}
