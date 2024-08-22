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
    showQuote,
    showExecute,
    showReport,
    isFormValid,
    kycStatus,
    setKycStatus,
    kycMessage,
    showKyc,
    handleKycModalClose,
    handleQuoteRequest,
    handleDealRequest,
    handleReset,
    executionMessage,
    handleExecutionModalClose,
    quoteData,
    dealData
  } = useCurrencyConversion();

  const minDate = addBusinessDays(new Date(), 2);
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <div className="converter-container">
      <KYCStatusModal show={showKyc} message={kycMessage} onClose={handleKycModalClose} />
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
        {showQuote && (
          <div className="mt-3">
            <p>FX Rate: {(quoteData.fxRate ?? 0).toFixed(5)}</p>
            <p>Amount to pay: {(quoteData.secondaryAmount ?? 0).toFixed(2)} {quoteData.fromCurrency}</p>
          </div>
        )}
{showExecute && (
  <div className="mt-3">
    <div className="form-group row align-items-center">
      <label className="col-sm-8 col-form-label text-right">Execute:</label>
      <div className="col-sm-4">
        <button 
          className="btn btn-success mr-2" 
          onClick={() => handleDealRequest({
            amount,
            toCurrency,
            selectedDate,
            fromCurrency,
            fxRate: quoteData.fxRate,
            secondaryAmount: quoteData.secondaryAmount,
            symbol: quoteData.symbol,
            quoteRequestID: quoteData.quoteRequestID,
            quoteID: quoteData.quoteID
          })}
        >
          YES
        </button>
        <button className="btn btn-danger" onClick={handleReset}>NO</button>
      </div>
    </div>
  </div>
)}

        {showReport && (
          console.log("showReport", showReport),
          console.log("executionMessage", executionMessage),
          console.log("dealData", dealData),
          <ExecutionReportModal 
            show={showReport} 
            message={executionMessage} 
            onClose={handleExecutionModalClose} 
            dealData={dealData}
            handleReset={handleReset} 
          />
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
