import React, { useState } from 'react';
import '../css/TradeEntry.css';
import useTradeEntry from '../hooks/useTradeEntry.js';
import ClientIDModal from './ClientIDModal.js';
import ExecutionReportModal from './ExecutionReportModal.js';
import ErrorModal from './ErrorModal.js';
import { isWeekday, addBusinessDays } from '../utils/utils.js';

const TradeEntry = ({ amplifyUsername }) => {

  const [side, setSide] = useState('Sell');
  const [tenor, setTenor] = useState('1M');

  const {
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    amount,
    setAmount,
    selectedDate,
    setSelectedDate,
    isFormValid,
    clientIDMessage,
    showClientID,
    handleClientIDModalClose,
    quote,
    showQuote,
    handleQuoteRequest,
    handleQuoteCancel,
    handleDealRequest,
    executionReport,
    showExecutionReport,
    executionReportMessage,
    handleExecutionModalClose,
    error,
    showError,
    errorMessage,
    handleErrorModalClose,
    handleReset
  } = useTradeEntry(amplifyUsername);

  const minDate = addBusinessDays(new Date(), 2);
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <div className="trade-entry-container">
      <ClientIDModal show={showClientID} message={clientIDMessage} onClose={handleClientIDModalClose} />
      <h2>Enter Trade</h2>
      <div className="card rounded p-4">
        <div className="trade-entry-row">
        <label>
        Side:
        <select value={side} onChange={e => setSide(e.target.value)}>
            <option value="Sell">Sell</option>
            <option value="Buy">Buy</option>
        </select>
        </label>
        <label>
            From:
            <input type="text" value={fromCurrency} onChange={e => setFromCurrency(e.target.value)} />
        </label>
        <label>
            To:
            <input type="text" value={toCurrency} onChange={e => setToCurrency(e.target.value)} />
        </label>

        <label>
            Amount:
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        </label>

        <label>
        Tenor:
        <select value={tenor} onChange={e => setTenor(e.target.value)}>
            <option value="SPOT">SPOT</option>
            <option value="1W">1W</option>
            <option value="1M">1M</option>
            <option value="3M">3M</option>
            <option value="6M">6M</option>
            <option value="1Y">1Y</option>
        </select>
        </label>

        <label>
          Date:
          <input
            type="date"
            value={selectedDate.toISOString().substring(0, 10)}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            min={minDate.toISOString().substring(0, 10)}
            max={maxDate.toISOString().substring(0, 10)}
            isWeekday={isWeekday} 
          />
        </label>

        <button onClick={handleQuoteRequest} disabled={!isFormValid}>
            Request
        </button>
        </div>

        {showQuote && (
          <>
            <div className="mt-3">
              <p>FX Rate: {quote.fxRate}</p>
              <p>You pay: {quote.secondaryAmount} {fromCurrency}</p>
            </div>
            <div className="form-group row align-items-center">
              <label className="col-sm-8 col-form-label text-right">Execute:</label>
              <div className="col-sm-4">
                <button className="btn btn-success mr-2" onClick={handleDealRequest}>YES</button>
                <button className="btn btn-danger" onClick={() => {
                  handleQuoteCancel();
                  handleReset();
                }}>NO</button>
              </div>
            </div>
          </>
        )}

        {showExecutionReport && (
          <ExecutionReportModal
            show={showExecutionReport}
            message={executionReportMessage}
            onClose={handleExecutionModalClose}
            executionReport={executionReport}
            handleReset={handleReset}
          />
        )}

        {showError && (
          <ErrorModal
            show={showError}
            message={errorMessage}
            onClose={handleErrorModalClose}
            error={error}
            handleReset={handleReset}
          />
        )}
      </div>
    </div>
  );
};

export default TradeEntry;
