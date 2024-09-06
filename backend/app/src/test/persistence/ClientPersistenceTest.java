package persistence;

import messages.Client;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ClientPersistenceTest {
    private static final Logger log = LogManager.getLogger(ClientPersistenceTest.class);

    private SqlPersistor sqlPersistor;

    @BeforeEach
    void setUp() {
        // Initialize an in-memory SQLite database for testing
        SqLiteInitializer.initializeDatabase();
        sqlPersistor.start();
    }

    @AfterEach
    void tearDown() throws InterruptedException {
        sqlPersistor.stop();
    }

    @Test
    void testPersistClientOnboarding() throws Exception {
        log.info("Running testPersistClientOnboarding");

        // Arrange
        Client client = new Client(
            87, "fullName", "dateOfBirth", "nationality", "governmentID",
            "socialSecurityNumber", "emailAddress", "phoneNumber", "residentialAddress",
            "bankAccount", "employmentInformation", "incomeAndTaxInformation",
            "verificationDocument", "riskAssessmentData"
        );

        // Act
        PersistenceQueue.getInstance().getQueue().put(client);
        Thread.sleep(1000); // Allow time for the message to be processed

        // Assert
        try (Connection conn = DriverManager.getConnection("jdbc:sqlite:client.db");
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT * FROM Client WHERE clientID = '87'")) {

            assertTrue(rs.next());
            assertEquals("clientID", rs.getInt(87));
            assertEquals("fullName", rs.getString("fullName"));
            assertEquals("nationality", rs.getString("nationality"));
            assertEquals("phoneNumber", rs.getString("phoneNumber"));
            assertEquals("verificationDocument", rs.getString("verificationDocument"));
        }
    }
}
