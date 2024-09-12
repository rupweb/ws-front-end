package ws.messages;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import persistence.SqlMessage;

public class Client implements SqlMessage {

    private int clientID;
    private String fullName;
    private String dateOfBirth;
    private String nationality;
    private String governmentID;
    private String socialSecurityNumber;
    private String emailAddress;
    private String phoneNumber;
    private String residentialAddress;
    private String bankAccount;
    private String employmentInformation;
    private String incomeAndTaxInformation;
    private String verificationDocument;
    private String riskAssessmentData;

    // Default constructor (needed by Jackson)
    public Client() {
    }

    public Client(int clientID, String fullName, String dateOfBirth, String nationality, String governmentID,
            String socialSecurityNumber, String emailAddress, String phoneNumber, String residentialAddress,
            String bankAccount, String employmentInformation, String incomeAndTaxInformation,
            String verificationDocument, String riskAssessmentData) {
        this.fullName = fullName;
        this.dateOfBirth = dateOfBirth;
        this.nationality = nationality;
        this.governmentID = governmentID;
        this.socialSecurityNumber = socialSecurityNumber;
        this.emailAddress = emailAddress;
        this.phoneNumber = phoneNumber;
        this.residentialAddress = residentialAddress;
        this.bankAccount = bankAccount;
        this.employmentInformation = employmentInformation;
        this.incomeAndTaxInformation = incomeAndTaxInformation;
        this.verificationDocument = verificationDocument;
        this.riskAssessmentData = riskAssessmentData;
    }

    public int getClientID() {
        return clientID;
    }

    public String getFullName() {
        return fullName;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public String getNationality() {
        return nationality;
    }

    public String getGovernmentID() {
        return governmentID;
    }

    public String getSocialSecurityNumber() {
        return socialSecurityNumber;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getResidentialAddress() {
        return residentialAddress;
    }

    public String getBankAccount() {
        return bankAccount;
    }

    public String getEmploymentInformation() {
        return employmentInformation;
    }

    public String getIncomeAndTaxInformation() {
        return incomeAndTaxInformation;
    }

    public String getVerificationDocument() {
        return verificationDocument;
    }

    public String getRiskAssessmentData() {
        return riskAssessmentData;
    }

    // Method to persist Client data to SQLite database
    public void persistToSQLite(String DB_STRING) {
        String sql = "INSERT INTO Client(clientID, fullName, dateOfBirth, nationality, governmentID, socialSecurityNumber, emailAddress, phoneNumber, residentialAddress, bankAccount, employmentInformation, incomeAndTaxInformation, verificationDocument, riskAssessmentData) " +
                     "VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DriverManager.getConnection(DB_STRING);
            PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, clientID);
            pstmt.setString(2, fullName);
            pstmt.setString(3, dateOfBirth);
            pstmt.setString(4, nationality);
            pstmt.setString(5, governmentID);
            pstmt.setString(6, socialSecurityNumber);
            pstmt.setString(7, emailAddress);
            pstmt.setString(8, phoneNumber);
            pstmt.setString(9, residentialAddress);
            pstmt.setString(10, bankAccount);
            pstmt.setString(11, employmentInformation);
            pstmt.setString(12, incomeAndTaxInformation);
            pstmt.setString(13, verificationDocument);
            pstmt.setString(14, riskAssessmentData);
            
            pstmt.executeUpdate();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

    @Override
    public String toString() {
        return "Client [clientID= " + clientID + ", fullName=" + fullName + ", dateOfBirth=" + dateOfBirth + ", nationality=" + nationality
                + ", governmentID=" + governmentID + ", socialSecurityNumber=" + socialSecurityNumber
                + ", emailAddress=" + emailAddress + ", phoneNumber=" + phoneNumber + ", residentialAddress="
                + residentialAddress + ", bankAccount=" + bankAccount + ", employmentInformation="
                + employmentInformation + ", incomeAndTaxInformation=" + incomeAndTaxInformation
                + ", verificationDocument=" + verificationDocument + ", riskAssessmentData=" + riskAssessmentData + "]";
    }
}
