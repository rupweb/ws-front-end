import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CurrencyConverter.css';

const currencyRates = {
  EURUSD: { bid: 1.0820, offer: 1.0840 },
  GBPUSD: { bid: 1.2510, offer: 1.2540 },
  EURGBP: { bid: 0.8570, offer: 0.8590 },
  USDCAD: { bid: 1.3760, offer: 1.3800 },
  EURCAD: { bid: 1.4938, offer: 1.4980 },
  GBPCAD: { bid: 1.7440, offer: 1.7460 }
};

const getConversionRate = (fromCurrency, toCurrency, rates) => {
  if (fromCurrency === 'EUR' && toCurrency === 'USD') return rates.EURUSD.bid;
  if (fromCurrency === 'USD' && toCurrency === 'EUR') return rates.EURUSD.offer;
  if (fromCurrency === 'GBP' && toCurrency === 'USD') return rates.GBPUSD.bid;
  if (fromCurrency === 'USD' && toCurrency === 'GBP') return rates.GBPUSD.offer;
  if (fromCurrency === 'EUR' && toCurrency === 'GBP') return rates.EURGBP.bid;
  if (fromCurrency === 'GBP' && toCurrency === 'EUR') return rates.EURGBP.offer;
  if (fromCurrency === 'USD' && toCurrency === 'CAD') return rates.USDCAD.offer;
  if (fromCurrency === 'CAD' && toCurrency === 'USD') return rates.USDCAD.bid;
  if (fromCurrency === 'EUR' && toCurrency === 'CAD') return rates.EURCAD.offer;
  if (fromCurrency === 'CAD' && toCurrency === 'EUR') return rates.EURCAD.bid;
  if (fromCurrency === 'GBP' && toCurrency === 'CAD') return rates.GBPCAD.offer;
  if (fromCurrency === 'CAD' && toCurrency === 'GBP') return rates.GBPCAD.bid;
  return 1;
};

const isWeekday = date => {
  const day = date.getDay();
  return day !== 0 && day !== 6;
};

const addBusinessDays = (date, days) => {
  let count = 0;
  let result = new Date(date);
  while (count < days) {
    result.setDate(result.getDate() + 1);
    if (isWeekday(result)) {
      count++;
    }
  }
  return result;
};

const CurrencyConverter = () => {
  const [fromCurrency, setFromCurrency] = useState('EUR'); // Default to EUR
  const [toCurrency, setToCurrency] = useState('USD'); // Default to USD
  const [amount, setAmount] = useState('');
  const [conversionRate, setConversionRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [selectedDate, setSelectedDate] = useState(addBusinessDays(new Date(), 2));
  const [showExecute, setShowExecute] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(
      fromCurrency && toCurrency && fromCurrency !== toCurrency && amount > 0
    );
  }, [fromCurrency, toCurrency, amount]);

  const handleConvert = () => {
    if (amount <= 0) {
      alert('Amount must be greater than zero');
      return;
    }
    const rate = getConversionRate(fromCurrency, toCurrency, currencyRates);
    setConversionRate(rate);
    let converted;
    
    // Determine if fromCurrency is the base currency by checking the currency pair names
    const pair = `${fromCurrency}${toCurrency}`;
    const reversePair = `${toCurrency}${fromCurrency}`;
    
    if (currencyRates[pair]) {
      // fromCurrency is the base currency
      converted = amount / rate;
    } else if (currencyRates[reversePair]) {
      // fromCurrency is the quote currency
      converted = amount * rate;
    } else {
      // Default case if currency pair is not found
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
  };

  const handleExecute = () => {
    alert('Execution Report: \n' +
          `Currency I need: ${toCurrency}\n` +
          `Amount I need: ${amount}\n` +
          `Delivery day: ${selectedDate.toLocaleDateString()}\n` +
          `Currency I have: ${fromCurrency}\n` +
          `Conversion Rate: ${conversionRate}\n` +
          `Amount Needed: ${convertedAmount.toFixed(2)} ${fromCurrency}`);
    handleReset();
  };

  const minDate = addBusinessDays(new Date(), 2);
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <div className="container mt-5">
      <div className="card rounded p-4">
        <div className="form-group row align-items-center">
          <label className="col-sm-8 col-form-label text-right">Sale price:</label>
          <div className="col-sm-4">
            <input
              type="number"
              className="form-control"
              value={amount}
              min="0"
              onChange={(e) => setAmount(Math.max(0, e.target.value))}
            />
          </div>
        </div>
        <div className="form-group row align-items-center">
          <label className="col-sm-8 col-form-label text-right">Sale currency:</label>
          <div className="col-sm-4">
            <select className="form-control" value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="CAD">CAD</option>
            </select>
          </div>
        </div>
        <div className="form-group row align-items-center">
          <label className="col-sm-8 col-form-label text-right">Delivery date:</label>
          <div className="col-sm-4">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              minDate={minDate}
              maxDate={maxDate}
              filterDate={isWeekday}
              className="form-control datepicker-input"
            />
          </div>
        </div>
        <div className="form-group row align-items-center">
          <label className="col-sm-8 col-form-label text-right">Currency I have:</label>
          <div className="col-sm-4">
            <select className="form-control" value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
              {['USD', 'EUR', 'GBP', 'CAD']
                .filter((currency) => currency !== toCurrency)
                .map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
            </select>
          </div>
        </div>
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
            <p>Amount: {convertedAmount.toFixed(2)} {fromCurrency}</p>
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
