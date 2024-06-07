// DeliveryDateField.js
import React from 'react';
import DatePicker from 'react-datepicker';
import FormField from './FormField';
import 'react-datepicker/dist/react-datepicker.css';

const DeliveryDateField = ({ selectedDate, setSelectedDate, minDate, maxDate, isWeekday }) => (
  <FormField label="Delivery date:">
    <DatePicker
      selected={selectedDate}
      onChange={(date) => setSelectedDate(date)}
      minDate={minDate}
      maxDate={maxDate}
      filterDate={isWeekday}
      className="form-control datepicker-input"
    />
  </FormField>
);

export default DeliveryDateField;

