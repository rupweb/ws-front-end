package aeron;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import agrona.admin.AdminDecoder;
import agrona.messages.MessageHeaderDecoder;
import io.aeron.Subscription;
import io.aeron.logbuffer.FragmentHandler;
import sbe.SbeAdminEncoder;

import app.App;
import setup.Setup;
import setup.SetupSingleton;
import utils.ProcessUtil;

public class AdminTest {
    private static final Logger log = LogManager.getLogger(AdminTest.class);

    SbeAdminEncoder sbeAdminEncoder = new SbeAdminEncoder();

    private volatile boolean testing = true;

    // Define admin message data
    String applicationName;
    String instanceId;
    String environment;
    String messageType;
    long timestamp;
    String detailedMessage;
    String hostInfo;

    @Test
    public void testSbeAdminMessage() throws InterruptedException {
        log.info("Running testSbeAdminMessage");

        // Setup test resources
        SetupSingleton.getInstance();

        // Send an Admin message when the Quoter starts
        applicationName = System.getProperty("application.name", "ws-front-end");
        instanceId = String.valueOf(ProcessHandle.current().pid());
        environment = System.getenv().getOrDefault("APP_ENV", "DEV");
        messageType = "TEST";
        timestamp = System.currentTimeMillis();
        detailedMessage = System.getProperty("user.dir");
        hostInfo = ProcessUtil.getHostInfo();

        // Prepare admin message listener
        Subscription subscription = App.getAeronClient().getAeron().addSubscription(AeronClient.ADMIN_CHANNEL, AeronClient.ADMIN_STREAM_ID);

        FragmentHandler fragmentHandler = (buffer, offset, length, header) -> {
            // Decode the message
            AdminDecoder decoder = new AdminDecoder();
            decoder.wrap(buffer, offset + MessageHeaderDecoder.ENCODED_LENGTH, AdminDecoder.BLOCK_LENGTH, AdminDecoder.SCHEMA_VERSION);

            // Verify the decoded message
            assertEquals(applicationName, decoder.applicationName());
            assertEquals(instanceId, decoder.instanceId());
            assertEquals(environment, decoder.environment());
            assertEquals(messageType, decoder.messageType());
            assertTrue(timestamp < decoder.timestamp());
            assertEquals(detailedMessage, decoder.detailedMessage());
            assertEquals(hostInfo, decoder.hostInfo());

            log.info("Received and verified admin message");

            testing = false;
        };

        Thread.startVirtualThread(() -> {
            while (testing) {
                subscription.poll(fragmentHandler, 10);
            }
        });

        // Give the subscription time to start
        Setup.sleepSeconds(1);

        messages.Admin admin = ProcessUtil.getAdminMessage("TEST", "");
        App.getAeronClient().getAdminSender().sendAdmin(admin);

        // Give the subscription time to process
        Setup.sleepSeconds(2);

        log.info("Completed testSbeAdminMessage");

        // Clean up test subscription
        subscription.close();
    }
}

