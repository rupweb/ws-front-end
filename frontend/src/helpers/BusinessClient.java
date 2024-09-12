package ws.messages;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import persistence.SqlMessage;

public class BusinessClient implements SqlMessage {

    private int clientID;
    private String registeredBusinessName;
    private String legalEntityIdentifier;
    private String registrationNumber;
    private String certificateOfIncorporation;
    private String taxIdentificationNumber;
    private String businessLicense;
    private String boardOfDirectors;
    private String shareholders;
    private String articlesOfAssociation;
    private String registeredAddress;
    private String contactDetails;
    private String bankAccountDetails;
    private String financialStatements;
    private String creditHistory;
    private String beneficialOwnershipInformation;
    private String riskAssessmentData;
    private String amlPoliciesAndProcedures;  

    // Default constructor (needed by Jackson)
    public BusinessClient() {
    }

    public BusinessClient(int clientID, String registeredBusinessName, String legalEntityIdentifier, String registrationNumber,
            String certificateOfIncorporation, String taxIdentificationNumber, String businessLicense,
            String boardOfDirectors, String shareholders, String articlesOfAssociation, String registeredAddress,
            String contactDetails, String bankAccountDetails, String financialStatements, String creditHistory,
            String beneficialOwnershipInformation, String riskAssessmentData, String amlPoliciesAndProcedures) {
        this.registeredBusinessName = registeredBusinessName;
        this.legalEntityIdentifier = legalEntityIdentifier;
        this.registrationNumber = registrationNumber;
        this.certificateOfIncorporation = certificateOfIncorporation;
        this.taxIdentificationNumber = taxIdentificationNumber;
        this.businessLicense = businessLicense;
        this.boardOfDirectors = boardOfDirectors;
        this.shareholders = shareholders;
        this.articlesOfAssociation = articlesOfAssociation;
        this.registeredAddress = registeredAddress;
        this.contactDetails = contactDetails;
        this.bankAccountDetails = bankAccountDetails;
        this.financialStatements = financialStatements;
        this.creditHistory = creditHistory;
        this.beneficialOwnershipInformation = beneficialOwnershipInformation;
        this.riskAssessmentData = riskAssessmentData;
        this.amlPoliciesAndProcedures = amlPoliciesAndProcedures;
    }

    public int getClientID() {
        return clientID;
    }

    public String getRegisteredBusinessName() {
        return registeredBusinessName;
    }

    public String getLegalEntityIdentifier() {
        return legalEntityIdentifier;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public String getCertificateOfIncorporation() {
        return certificateOfIncorporation;
    }

    public String getTaxIdentificationNumber() {
        return taxIdentificationNumber;
    }

    public String getBusinessLicense() {
        return businessLicense;
    }

    public String getBoardOfDirectors() {
        return boardOfDirectors;
    }

    public String getShareholders() {
        return shareholders;
    }

    public String getArticlesOfAssociation() {
        return articlesOfAssociation;
    }

    public String getRegisteredAddress() {
        return registeredAddress;
    }

    public String getContactDetails() {
        return contactDetails;
    }

    public String getBankAccountDetails() {
        return bankAccountDetails;
    }

    public String getFinancialStatements() {
        return financialStatements;
    }

    public String getCreditHistory() {
        return creditHistory;
    }

    public String getBeneficialOwnershipInformation() {
        return beneficialOwnershipInformation;
    }

    public String getRiskAssessmentData() {
        return riskAssessmentData;
    }

    public String getAmlPoliciesAndProcedures() {
        return amlPoliciesAndProcedures;
    }

    // Method to persist BusinessClient data to SQLite database
    @Override
    public void persistToSQLite(String DB_STRING) {
        String sql = "INSERT INTO BusinessClient(clientID, registeredBusinessName, legalEntityIdentifier, registrationNumber, certificateOfIncorporation, taxIdentificationNumber, businessLicense, boardOfDirectors, shareholders, articlesOfAssociation, registeredAddress, contactDetails, bankAccountDetails, financialStatements, creditHistory, beneficialOwnershipInformation, riskAssessmentData, amlPoliciesAndProcedures) " +
                     "VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DriverManager.getConnection(DB_STRING);
            PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, clientID);
            pstmt.setString(2, registeredBusinessName);
            pstmt.setString(3, legalEntityIdentifier);
            pstmt.setString(4, registrationNumber);
            pstmt.setString(5, certificateOfIncorporation);
            pstmt.setString(6, taxIdentificationNumber);
            pstmt.setString(7, businessLicense);
            pstmt.setString(8, boardOfDirectors);
            pstmt.setString(9, shareholders);
            pstmt.setString(10, articlesOfAssociation);
            pstmt.setString(11, registeredAddress);
            pstmt.setString(12, contactDetails);
            pstmt.setString(13, bankAccountDetails);
            pstmt.setString(14, financialStatements);
            pstmt.setString(15, creditHistory);
            pstmt.setString(16, beneficialOwnershipInformation);
            pstmt.setString(17, riskAssessmentData);
            pstmt.setString(18, amlPoliciesAndProcedures);
            
            pstmt.executeUpdate();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

    @Override
    public String toString() {
        return "BusinessClient [clientID=" + clientID + ", registeredBusinessName=" + registeredBusinessName + ", legalEntityIdentifier="
                + legalEntityIdentifier + ", registrationNumber=" + registrationNumber + ", certificateOfIncorporation="
                + certificateOfIncorporation + ", taxIdentificationNumber=" + taxIdentificationNumber
                + ", businessLicense=" + businessLicense + ", boardOfDirectors=" + boardOfDirectors + ", shareholders="
                + shareholders + ", articlesOfAssociation=" + articlesOfAssociation + ", registeredAddress="
                + registeredAddress + ", contactDetails=" + contactDetails + ", bankAccountDetails="
                + bankAccountDetails + ", financialStatements=" + financialStatements + ", creditHistory="
                + creditHistory + ", beneficialOwnershipInformation=" + beneficialOwnershipInformation
                + ", riskAssessmentData=" + riskAssessmentData + ", amlPoliciesAndProcedures="
                + amlPoliciesAndProcedures + "]";
    }    
} 
