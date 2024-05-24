// FormField.js
import React from 'react';

const FormField = ({ label, children }) => (
  <div className="form-group row align-items-center">
    <label className="col-sm-8 col-form-label text-right">{label}</label>
    <div className="col-sm-4">
      {children}
    </div>
  </div>
);

export default FormField;
