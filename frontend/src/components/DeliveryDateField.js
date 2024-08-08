// DeliveryDateField.js
import React from 'react';
import DatePickerModule from 'react-datepicker';
import FormField from './FormField.js';
import 'react-datepicker/dist/react-datepicker.css';

const DatePicker = DatePickerModule.default;

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
