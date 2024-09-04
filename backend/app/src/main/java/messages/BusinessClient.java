package messages;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class BusinessClient {
    public String registeredBusinessName;
    public String legalEntityIdentifier;
    public String registrationNumber;
    public String certificateOfIncorporation;
    public String taxIdentificationNumber;
    public String businessLicense;
    public String boardOfDirectors;
    public String shareholders;
    public String articlesOfAssociation;
    public String registeredAddress;
    public String contactDetails;
    public String bankAccountDetails;
    public String financialStatements;
    public String creditHistory;
    public String beneficialOwnershipInformation;
    public String riskAssessmentData;
    public String amlPoliciesAndProcedures;  

    // Default constructor (needed by Jackson)
    public BusinessClient() {
    }

    public BusinessClient(String registeredBusinessName, String legalEntityIdentifier, String registrationNumber,
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
    public void persistToSQLite() {
        String sql = "INSERT INTO BusinessClient(registeredBusinessName, legalEntityIdentifier, registrationNumber, certificateOfIncorporation, taxIdentificationNumber, businessLicense, boardOfDirectors, shareholders, articlesOfAssociation, registeredAddress, contactDetails, bankAccountDetails, financialStatements, creditHistory, beneficialOwnershipInformation, riskAssessmentData, amlPoliciesAndProcedures) " +
                     "VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DriverManager.getConnection("jdbc:sqlite:client.db");
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, registeredBusinessName);
            pstmt.setString(2, legalEntityIdentifier);
            pstmt.setString(3, registrationNumber);
            pstmt.setString(4, certificateOfIncorporation);
            pstmt.setString(5, taxIdentificationNumber);
            pstmt.setString(6, businessLicense);
            pstmt.setString(7, boardOfDirectors);
            pstmt.setString(8, shareholders);
            pstmt.setString(9, articlesOfAssociation);
            pstmt.setString(10, registeredAddress);
            pstmt.setString(11, contactDetails);
            pstmt.setString(12, bankAccountDetails);
            pstmt.setString(13, financialStatements);
            pstmt.setString(14, creditHistory);
            pstmt.setString(15, beneficialOwnershipInformation);
            pstmt.setString(16, riskAssessmentData);
            pstmt.setString(17, amlPoliciesAndProcedures);
            
            pstmt.executeUpdate();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }

    @Override
    public String toString() {
        return "BusinessClient [registeredBusinessName=" + registeredBusinessName + ", legalEntityIdentifier="
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
