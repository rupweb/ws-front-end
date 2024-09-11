// ClientIDField.js
import React from 'react';
import FormField from './FormField.js';

const ClientIDField = ({ clientID, setClientID }) => (
  <FormField label="My client ID:">
    <select className="form-control" value={clientID} onChange={(e) => setClientID(e.target.value)}>
      <option value="TEST">TEST</option>
      <option value="OTHER">Other</option>
    </select>
  </FormField>
);

export default ClientIDField;
