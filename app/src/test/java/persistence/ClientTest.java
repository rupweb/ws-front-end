package persistence;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.jupiter.api.Test;

import app.App;
import messages.Client;
import setup.Setup;
import setup.SetupSingleton;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.ObjectMapper;

class ClientTest {
    private static final Logger log = LogManager.getLogger(ClientTest.class);

    // Define client data
    String clientID;
    String cognitoSub;
    String fullName;
    String dateOfBirth;
    String nationality;
    String governmentID;
    String socialSecurityNumber;
    String emailAddress;
    String phoneNumber;
    String residentialAddress;
    String bankAccount;
    String employmentInformation;
    String incomeAndTaxInformation;
    String verificationDocument;
    String riskAssessmentData;

    @Test
    void testPersistClient() throws Exception {
        log.info("Running testPersistClient");

        /*
        * 1. Create a client insert
        * 2. Check the persistence queue gets the insert
        */        

        // Setup test resources
        SetupSingleton.getInstance();

        // Populate client data
        clientID = "88";
        cognitoSub = "";
        fullName = "Test client";
        dateOfBirth = "";
        nationality = "GB";
        governmentID = "12345678";
        socialSecurityNumber = "12345678";
        emailAddress = "rupert@webstersystems.co.uk";
        phoneNumber = "00447740289100";
        residentialAddress = "International";
        bankAccount = "1234 5678";
        employmentInformation = "";
        incomeAndTaxInformation = "";
        verificationDocument = "";
        riskAssessmentData = "";

        // Arrange
        // Create a client insert
        Client client = new Client(clientID, fullName, dateOfBirth, nationality, governmentID, 
            socialSecurityNumber, emailAddress, phoneNumber, residentialAddress, bankAccount, 
            employmentInformation, incomeAndTaxInformation, verificationDocument, riskAssessmentData);

        // Act
        log.info("Persist client to {} as JSON string", App.getClientDbURL());

        ObjectMapper objectMapper = new ObjectMapper();
        String clientJSON = objectMapper.writeValueAsString(client);

        PersistenceQueue.getInstance().getQueue().put(clientJSON);
        Setup.sleepSeconds(2); // Allow time for the message to process

        // Assert
        try (Connection conn = DriverManager.getConnection(App.getClientDbURL());
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT * FROM Client WHERE clientID = '" + clientID + "'")) {

            assertTrue(rs.next());
            assertEquals(clientID, rs.getString("clientID"));
            assertEquals(fullName, rs.getString("fullName"));
            assertEquals(dateOfBirth, rs.getString("dateOfBirth"));
            assertEquals(nationality, rs.getString("nationality"));
            assertEquals(governmentID, rs.getString("governmentID"));
            assertEquals(socialSecurityNumber, rs.getString("socialSecurityNumber"));
            assertEquals(emailAddress, rs.getString("emailAddress"));
            assertEquals(phoneNumber, rs.getString("phoneNumber"));
            assertEquals(residentialAddress, rs.getString("residentialAddress"));
            assertEquals(bankAccount, rs.getString("bankAccount"));
            assertEquals(employmentInformation, rs.getString("employmentInformation"));
            assertEquals(incomeAndTaxInformation, rs.getString("incomeAndTaxInformation"));
            assertEquals(verificationDocument, rs.getString("verificationDocument"));
            assertEquals(riskAssessmentData, rs.getString("riskAssessmentData"));

            log.info("Read and verified client row");
        }
    }
}
