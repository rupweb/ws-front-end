// KYCStatusField.js
import React from 'react';
import FormField from './FormField.js';

const KYCStatusField = ({ kycStatus, setKycStatus }) => (
  <FormField label="My KYC status:">
    <select className="form-control" value={kycStatus} onChange={(e) => setKycStatus(e.target.value)}>
      <option value="NOT_STARTED">Not Started</option>
      <option value="PENDING">Pending</option>
      <option value="VERIFIED">Verified</option>
      <option value="OTHER">Other</option>
    </select>
  </FormField>
);

export default KYCStatusField;
