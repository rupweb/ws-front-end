import React from 'react';
import '../css/TradeEntry.css';
import useTradeEntry from '../hooks/useTradeEntry.js';
import ClientIDModal from './ClientIDModal.js';
import ExecutionReportModal from './ExecutionReportModal.js';
import ErrorModal from './ErrorModal.js';
import SpotTradeEntry from './SpotTradeEntry.js';
import SwapTradeEntry from './SwapTradeEntry.js';
import MultiLegTradeEntry from './MultiLegTradeEntry.js';
import { addBusinessDays } from '../utils/utils.js';
import { buildTradeQuoteRows } from '../utils/trading.js';

const TradeEntry = ({ amplifyUsername }) => {
  const {
    transactionType,
    setTransactionType,
    symbol,
    setSymbol,
    symbolOptions,
    currencyOptions,
    legs,
    setLegs,
    handleTradeCurrencyChange,
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
    handleReset,
  } = useTradeEntry(amplifyUsername);

  const minDate = addBusinessDays(new Date(), 2);
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const quoteRows = buildTradeQuoteRows(quote);

  const renderTradeForm = () => {
    if (transactionType === 'SPO' || transactionType === 'FWD') {
      return (
        <SpotTradeEntry
          legs={legs}
          setLegs={setLegs}
          minDate={minDate}
          maxDate={maxDate}
          handleQuoteRequest={handleQuoteRequest}
          currencyOptions={currencyOptions}
          onCurrencyChange={handleTradeCurrencyChange}
        />
      );
    }

    if (transactionType === 'SWP') {
      return (
        <SwapTradeEntry
          legs={legs}
          setLegs={setLegs}
          minDate={minDate}
          maxDate={maxDate}
          handleQuoteRequest={handleQuoteRequest}
          currencyOptions={currencyOptions}
          onCurrencyChange={handleTradeCurrencyChange}
        />
      );
    }

    return (
      <MultiLegTradeEntry
        legs={legs}
        setLegs={setLegs}
        minDate={minDate}
        maxDate={maxDate}
        handleQuoteRequest={handleQuoteRequest}
        currencyOptions={currencyOptions}
        onCurrencyChange={handleTradeCurrencyChange}
      />
    );
  };

  return (
    <div className="trade-entry-container">
      <ClientIDModal show={showClientID} message={clientIDMessage} onClose={handleClientIDModalClose} />

      <h2>Enter Trade</h2>
      <div className="card rounded p-4">
        <div className="trade-entry-row">
          <label>
            Type: <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
              <option value="SPO">Spot</option>
              <option value="FWD">Forward</option>
              <option value="SWP">Swap</option>
              <option value="MUL">Multileg</option>
            </select>
          </label>

          <label>
              Symbol: <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
                {symbolOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
          </label>
        </div>
  
        {renderTradeForm()}

        {showQuote && (
          <>
            <div className="mt-3">
              {quoteRows.map((row) => (
                <p key={row.key}>
                  Leg {row.index}: {row.side} {row.amount} {row.currency} {row.valueDate} @ {row.rate} = {row.counterAmount} {row.counterCurrency}
                </p>
              ))}
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
