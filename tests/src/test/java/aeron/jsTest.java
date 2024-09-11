package aeron;

import java.io.IOException;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Value;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

import utils.Utils;

public class jsTest {
    private static final Logger log = LogManager.getLogger(jsTest.class);

    @Test
    public void encodeTest() throws IOException {
        log.info("In encodeTest");

        System.out.println("Test Working Directory: " + System.getProperty("user.dir"));

        // Create GraalVM context
        try (Context context = Context.newBuilder("js").allowAllAccess(true).build()) {
            // Redirect console.log to Java's System.out
            context.eval("js", "console.log = function(...args) { java.lang.System.out.println(args.map(String).join(' ')); };");

            // Load the new JavaScript file
            String encodeTestScript = Utils.convertES6ToCommonJS(Utils.loadScript("tests/src/test/java/aeron/encodeTest.js"));

            // Evaluate the script
            context.eval("js", encodeTestScript);

            log.info("encodeTestScript: " + encodeTestScript);

            // New test data
            String dataScript = "const data = {" +
                    "id: 'TEST123', " +
                    "value: 42, " +
                    "description: 'This is a test', " +
                    "timestamp: '2024-08-01T14:30:00Z'" +
                    "};";
            context.eval("js", dataScript);

            log.info("dataScript: " + dataScript);

            try {
                log.info("Try encodeTest function");
                Value result = context.eval("js", "encodeTest(data);");

                // Check the result type
                if (result.hasArrayElements()) {
                    // Convert the result to Uint8Array and log it
                    int length = (int) result.getArraySize();
                    byte[] encodedBuffer = new byte[length];
                    for (int i = 0; i < length; i++) {
                        encodedBuffer[i] = (byte) result.getArrayElement(i).asInt();
                    }

                    log.info("Log encoded buffer");
                    for (byte b : encodedBuffer) {
                        System.out.printf("%02x ", b);
                    }

                    System.out.println("");

                    // Assertions
                    assertNotNull(encodedBuffer);
                    assertTrue(encodedBuffer.length > 0);

                    assertEquals(encodedBuffer[0], 10);
                    assertEquals(encodedBuffer[1], 20);
                    assertEquals(encodedBuffer[2], 30);
                    assertEquals(encodedBuffer[3], 40);
                    assertEquals(encodedBuffer[4], 50);
                } else {
                    System.out.println("Result does not have array elements.");
                    System.out.println("Result is: " + result.toString());
                }

            } catch (Exception e) {
                System.out.println("JavaScript evaluation error: " + e.getMessage());
            }
        }

        log.info("Out encodeTest");
    }
}
