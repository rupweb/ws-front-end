package messages;

import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Source;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.core.config.Configurator;
import org.apache.logging.log4j.status.StatusLogger;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static org.junit.jupiter.api.Assertions.fail;

public class UseSbeTest {
    private static final Logger log = LogManager.getLogger(UseSbeTest.class);

    @BeforeAll
    static void setup() {
        System.setProperty("log4j.configurationFile", "src/test/resources/log4j2.xml");
        Configurator.initialize(null, "src/test/resources/log4j2.xml");
        StatusLogger.getLogger().setLevel(org.apache.logging.log4j.Level.INFO);
        System.out.println("Log4j2 test initialized: " + LogManager.getContext(false).hasLogger(UseSbeTest.class.getName()));
        System.out.println("Test Working Directory: " + System.getProperty("user.dir"));
        System.out.println("Log4j2 Configuration File: " + System.getProperty("log4j.configurationFile"));
    }

    @Test
    public void testSbeRequest() {
        log.info("Running testSbeRequest");

        Path filePath = Paths.get("../frontend/src/messages/sbeRequest.js");
        log.info("File path: " + filePath.toAbsolutePath());

        // Load JavaScript file
        String encodeQuoteRequest;
        try {
            encodeQuoteRequest = new String(Files.readAllBytes(filePath));
            log.info("Successfully read JavaScript file: " + filePath);
            log.debug("JavaScript file content:\n" + encodeQuoteRequest);
        } catch (IOException e) {
            log.error("Failed to read JavaScript file: " + e.getMessage(), e);
            fail("Failed to read JavaScript file: " + e.getMessage());
            return;
        }

        // Evaluate JavaScript file
        try (Context context = Context.newBuilder().allowAllAccess(true).build()) {
            log.info("Evaluating JavaScript file");
            context.eval(Source.newBuilder("js", encodeQuoteRequest, "encodeQuoteRequest.js").build());
            log.info("Successfully evaluated JavaScript file");
        } catch (Exception e) {
            log.error("Failed to evaluate JavaScript file: " + e.getMessage(), e);
            fail("Failed to evaluate JavaScript file: " + e.getMessage());
        }
    }
}
