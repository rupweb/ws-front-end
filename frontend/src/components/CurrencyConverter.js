import React from 'react';
import useCurrencyConversion from '../hooks/useCurrencyConversion.js';
import KYCStatusModal from './KYCStatusModal.js';
import ExecutionReportModal from './ExecutionReportModal.js';
import SalePriceField from './SalePriceField.js';
import SaleCurrencyField from './SaleCurrencyField.js';
import DeliveryDateField from './DeliveryDateField.js';
import FromCurrencyField from './FromCurrencyField.js';
import KYCStatusField from './KYCStatusField.js';
import { addBusinessDays, isWeekday } from '../utils/utils.js';
import '../css/CurrencyConverter.css';

const CurrencyConverter = () => {
  const {
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    amount,
    setAmount,
    selectedDate,
    setSelectedDate,
    showExecute,
    isFormValid,
    kycStatus,
    setKycStatus,
    kycModalMessage,
    showKycModal,
    executionModalMessage,
    showExecutionModal,
    handleQuoteRequest,
    handleDealRequest,
    handleReset,
    handleKycModalClose,
    handleExecutionModalClose,
    quoteData, // Destructure quoteData from the hook
  } = useCurrencyConversion();

  const minDate = addBusinessDays(new Date(), 2);
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <div className="converter-container">
      <KYCStatusModal show={showKycModal} message={kycModalMessage} onClose={handleKycModalClose} />
      <ExecutionReportModal show={showExecutionModal} message={executionModalMessage} onClose={handleExecutionModalClose} />
      <div className="card rounded p-4">
        <SalePriceField amount={amount} setAmount={setAmount} />
        <SaleCurrencyField toCurrency={toCurrency} setToCurrency={setToCurrency} />
        <DeliveryDateField 
          selectedDate={selectedDate} 
          setSelectedDate={setSelectedDate} 
          minDate={minDate} 
          maxDate={maxDate} 
          isWeekday={isWeekday} 
        />
        <FromCurrencyField fromCurrency={fromCurrency} setFromCurrency={setFromCurrency} toCurrency={toCurrency} />
        <KYCStatusField kycStatus={kycStatus} setKycStatus={setKycStatus} />
        <div>
          <button
            className="btn btn-primary btn-block"
            onClick={handleQuoteRequest}
            disabled={!isFormValid}
            style={{ backgroundColor: isFormValid ? 'blue' : 'lightblue' }}
          >
            Convert
          </button>
        </div>
        {quoteData.conversionRate && (
          <div className="mt-3">
            <p>FX Rate: {quoteData.conversionRate}</p>
            <p>Amount to pay: {quoteData.convertedAmount.toFixed(2)} {quoteData.fromCurrency}</p>
          </div>
        )}
        {showExecute && (
          <div className="mt-3">
            <div className="form-group row align-items-center">
              <label className="col-sm-8 col-form-label text-right">Execute:</label>
              <div className="col-sm-4">
                <button className="btn btn-success mr-2" onClick={handleDealRequest}>YES</button>
                <button className="btn btn-danger" onClick={handleReset}>NO</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
