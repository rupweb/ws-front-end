// src/components/Onboarding.js

import React, { useState } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext.js';

function Onboarding() {
  const [clientType, setClientType] = useState('individual');
  const [clientData, setClientData] = useState({});
  const { sendMessage } = useWebSocket();
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientData({
      ...clientData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send the clientData to backend service
    const payload = {
        clientType: clientType,
        data: clientData,
      };
  
    sendMessage(JSON.stringify(payload));
    console.log('Onboarding data sent:', payload);
  };

  return (
    <div className="onboarding-container">
      <h2>Client Onboarding</h2>
      <label>
        <input
          type="radio"
          value="individual"
          checked={clientType === 'individual'}
          onChange={() => setClientType('individual')}
        />
        Individual
      </label>
      <label>
        <input
          type="radio"
          value="corporate"
          checked={clientType === 'corporate'}
          onChange={() => setClientType('corporate')}
        />
        Corporate
      </label>

      <form onSubmit={handleSubmit}>
        {clientType === 'individual' && (
          <div>
            <h3>Individual Client Information</h3>
            <input type="text" name="fullName" placeholder="Full Name" onChange={handleInputChange} required />
            <input type="date" name="dateOfBirth" placeholder="Date of Birth" onChange={handleInputChange} required />
            <input type="text" name="nationality" placeholder="Nationality" onChange={handleInputChange} required />
            <input type="text" name="governmentID" placeholder="Government ID" onChange={handleInputChange} required />
            <input type="text" name="socialSecurityNumber" placeholder="Social Security Number" onChange={handleInputChange} required />
            <input type="email" name="emailAddress" placeholder="Email Address" onChange={handleInputChange} required />
            <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleInputChange} required />
            <input type="text" name="residentialAddress" placeholder="Residential Address" onChange={handleInputChange} required />
            <input type="text" name="bankAccount" placeholder="Bank Account" onChange={handleInputChange} required />
            <input type="text" name="employmentInformation" placeholder="Employment Information" onChange={handleInputChange} required />
            <input type="text" name="incomeAndTaxInformation" placeholder="Income and Tax Information" onChange={handleInputChange} required />
            <input type="file" name="verificationDocument" onChange={handleInputChange} required />
            <input type="text" name="riskAssessmentData" placeholder="Risk Assessment Data" onChange={handleInputChange} required />
          </div>
        )}

        {clientType === 'corporate' && (
          <div>
            <h3>Corporate Client Information</h3>
            <input type="text" name="registeredBusinessName" placeholder="Registered Business Name" onChange={handleInputChange} required />
            <input type="text" name="legalEntityIdentifier" placeholder="Legal Entity Identifier" onChange={handleInputChange} required />
            <input type="text" name="registrationNumber" placeholder="Registration Number" onChange={handleInputChange} required />
            <input type="file" name="certificateOfIncorporation" onChange={handleInputChange} required />
            <input type="text" name="taxIdentificationNumber" placeholder="Tax Identification Number" onChange={handleInputChange} required />
            <input type="file" name="businessLicense" onChange={handleInputChange} required />
            <textarea name="boardOfDirectors" placeholder="Board of Directors" onChange={handleInputChange} required></textarea>
            <textarea name="shareholders" placeholder="Shareholders" onChange={handleInputChange} required></textarea>
            <textarea name="articlesOfAssociation" placeholder="Articles of Association" onChange={handleInputChange} required></textarea>
            <input type="text" name="registeredAddress" placeholder="Registered Address" onChange={handleInputChange} required />
            <input type="text" name="contactDetails" placeholder="Contact Details" onChange={handleInputChange} required />
            <input type="text" name="bankAccountDetails" placeholder="Bank Account Details" onChange={handleInputChange} required />
            <input type="file" name="financialStatements" onChange={handleInputChange} required />
            <input type="text" name="creditHistory" placeholder="Credit History" onChange={handleInputChange} required />
            <textarea name="beneficialOwnershipInformation" placeholder="Beneficial Ownership Information" onChange={handleInputChange} required></textarea>
            <input type="text" name="riskAssessmentData" placeholder="Risk Assessment Data" onChange={handleInputChange} required />
            <textarea name="amlPoliciesAndProcedures" placeholder="AML Policies and Procedures" onChange={handleInputChange} required></textarea>
          </div>
        )}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Onboarding;
