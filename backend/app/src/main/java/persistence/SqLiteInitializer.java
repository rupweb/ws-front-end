package persistence;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class SqLiteInitializer {

    private static final String URL = "jdbc:sqlite:client.db";

    // Establish the connection to the SQLite database
    private static Connection connect() throws SQLException {
        return DriverManager.getConnection(URL);
    }

    // Method to initialize the database and ensure all tables exist
    public static void initializeDatabase() {
        try (Connection conn = connect()) {
            if (conn != null) {
                // Check and create each table
                createClientTable(conn);
                createBusinessClientTable(conn);
                System.out.println("Database initialized successfully.");
            }
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

    // Method to create the Client table if it doesn't exist
    private static void createClientTable(Connection conn) throws SQLException {
        String sql = "CREATE TABLE IF NOT EXISTS Client (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT," +
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
                "amlPoliciesAndProcedures TEXT" +
                ");";
        try (Statement stmt = conn.createStatement()) {
            stmt.execute(sql);
        }
    }

    public static void main(String[] args) {
        initializeDatabase();
    }
}

