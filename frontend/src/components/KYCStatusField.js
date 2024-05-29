// KYCStatusField.js
import React from 'react';
import FormField from './FormField';

const KYCStatusField = ({ kycStatus, setKycStatus }) => (
  <FormField label="My KYC status:">
    <select className="form-control" value={kycStatus} onChange={(e) => setKycStatus(e.target.value)}>
      <option value="Not Started">Not Started</option>
      <option value="Pending">Pending</option>
      <option value="Verified">Verified</option>
      <option value="Other">Other</option>
    </select>
  </FormField>
);

export default KYCStatusField;
