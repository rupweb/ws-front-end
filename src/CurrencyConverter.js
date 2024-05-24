// CurrencyConverter.js
import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CurrencyConverter.css';
import { currencyRates, getConversionRate, isWeekday, addBusinessDays } from './utils';
import KYCStatusModal from './KYCStatusModal';
import ExecutionReportModal from './ExecutionReportModal';
import SalePriceField from './SalePriceField';
import SaleCurrencyField from './SaleCurrencyField';
import DeliveryDateField from './DeliveryDateField';
import FromCurrencyField from './FromCurrencyField';
import KYCStatusField from './KYCStatusField';

const CurrencyConverter = () => {
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [conversionRate, setConversionRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [selectedDate, setSelectedDate] = useState(addBusinessDays(new Date(), 2));
  const [showExecute, setShowExecute] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [kycStatus, setKycStatus] = useState('Not Started');
  const prevKycStatusRef = useRef('Not Started');
  const [kycModalMessage, setKycModalMessage] = useState('');
  const [showKycModal, setShowKycModal] = useState(false);
  const [executionModalMessage, setExecutionModalMessage] = useState('');
  const [showExecutionModal, setShowExecutionModal] = useState(false);

  useEffect(() => {
    setIsFormValid(fromCurrency && toCurrency && fromCurrency !== toCurrency && amount > 0);
  }, [fromCurrency, toCurrency, amount]);

  useEffect(() => {
    const prevKycStatus = prevKycStatusRef.current;
    if (prevKycStatus === 'Verified' && kycStatus !== 'Verified') {
      handleReset();
    }
    prevKycStatusRef.current = kycStatus;
  }, [kycStatus]);

  const handleConvert = () => {
    if (kycStatus === 'Not Started' || kycStatus === 'Pending') {
      setKycModalMessage('Please complete the Dotmed KYC form.');
      setShowKycModal(true);
      return;
    }

    if (kycStatus !== 'Verified') {
      setKycModalMessage('KYC check in process');
      setShowKycModal(true);

      setTimeout(() => {
        setKycModalMessage('KYC unverified');
        setShowKycModal(true);
      }, 2000);
      return;
    }

    if (amount <= 0) {
      alert('Amount must be greater than zero');
      return;
    }

    const rate = getConversionRate(fromCurrency, toCurrency, currencyRates);
    setConversionRate(rate);
    let converted;
    
    const pair = `${fromCurrency}${toCurrency}`;
    const reversePair = `${toCurrency}${fromCurrency}`;
    
    if (currencyRates[pair]) {
      converted = amount / rate;
    } else if (currencyRates[reversePair]) {
      converted = amount * rate;
    } else {
      alert('Currency pair not supported');
      return;
    }
  
    setConvertedAmount(converted);
    setShowExecute(true);
  };  

  const handleReset = () => {
    setFromCurrency('EUR');
    setToCurrency('USD');
    setAmount('');
    setConversionRate(null);
    setConvertedAmount(null);
    setSelectedDate(addBusinessDays(new Date(), 2));
    setShowExecute(false);
    setIsFormValid(false);
    setKycStatus('Not Started');
  };

  const handleExecute = () => {
    setExecutionModalMessage(`Execution Report: 
      Sale price: ${toCurrency}
      Sale currency: ${amount}
      Delivery date: ${selectedDate.toLocaleDateString()}
      Currency I have: ${fromCurrency}
      FX Rate: ${conversionRate}
      Amount to pay: ${convertedAmount.toFixed(2)} ${fromCurrency}`);
    setShowExecutionModal(true);
    handleReset();
  };

  const handleKycModalClose = () => {
    setShowKycModal(false);
  };

  const handleExecutionModalClose = () => {
    setShowExecutionModal(false);
  };

  const minDate = addBusinessDays(new Date(), 2);
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <div className="container mt-5">
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
            onClick={handleConvert}
            disabled={!isFormValid}
            style={{ backgroundColor: isFormValid ? 'blue' : 'lightblue' }}
          >
            Convert
          </button>
        </div>
        {conversionRate && (
          <div className="mt-3">
            <p>FX Rate: {conversionRate}</p>
            <p>Amount to pay: {convertedAmount.toFixed(2)} {fromCurrency}</p>
          </div>
        )}
        {showExecute && (
          <div className="mt-3">
            <div className="form-group row align-items-center">
              <label className="col-sm-8 col-form-label text-right">Execute:</label>
              <div className="col-sm-4">
                <button className="btn btn-success mr-2" onClick={handleExecute}>YES</button>
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
