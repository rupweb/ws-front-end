package persistence;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class ClientDbInitializer {
    private static final Logger log = LogManager.getLogger(ClientDbInitializer.class);

    // Establish the connection to the SQLite database
    private static Connection connect(String URL) throws SQLException {
        return DriverManager.getConnection(URL);
    }

    // Method to initialize the database and ensure all tables exist
    public static void initializeDatabase(String URL) {
        try (Connection conn = connect(URL)) {
            if (conn != null) {
                createClientTable(conn);
                createBusinessClientTable(conn);
                log.info("SQLite Client DB initialized");
            }
        } catch (SQLException e) {
            log.error(e.getMessage());
        }
    }

    // Method to create the Client table if it doesn't exist
    private static void createClientTable(Connection conn) throws SQLException {
        String sql = "CREATE TABLE IF NOT EXISTS Client (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                "clientID TEXT," +
                "cognitoSub TEXT," +
                "fullName TEXT," +
                "dateOfBirth TEXT," +
                "nationality TEXT," +
                "governmentID TEXT," +
                "socialSecurityNumber TEXT," +
                "emailAddress TEXT," +
                "phoneNumber TEXT," +
                "residentialAddress TEXT," +
                "bankAccount TEXT," +
                "employmentInformation TEXT," +
                "incomeAndTaxInformation TEXT," +
                "verificationDocument TEXT," +
                "riskAssessmentData TEXT" +
                ");";
        try (Statement stmt = conn.createStatement()) {
            stmt.execute(sql);
        }
    }

    // Method to create the BusinessClient table if it doesn't exist
    private static void createBusinessClientTable(Connection conn) throws SQLException {
        String sql = "CREATE TABLE IF NOT EXISTS BusinessClient (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                "clientID TEXT," + 
                "cognitoSub TEXT," +
                "registeredBusinessName TEXT," +
                "legalEntityIdentifier TEXT," +
                "registrationNumber TEXT," +
                "certificateOfIncorporation TEXT," +
                "taxIdentificationNumber TEXT," +
                "businessLicense TEXT," +
                "boardOfDirectors TEXT," +
                "shareholders TEXT," +
                "articlesOfAssociation TEXT," +
                "registeredAddress TEXT," +
                "contactDetails TEXT," +
                "bankAccountDetails TEXT," +
                "financialStatements TEXT," +
                "creditHistory TEXT," +
                "beneficialOwnershipInformation TEXT," +
                "riskAssessmentData TEXT," +
                "amlPoliciesAndProcedures TEXT," +  
                ");";
        try (Statement stmt = conn.createStatement()) {
            stmt.execute(sql);
        }
    }
}

