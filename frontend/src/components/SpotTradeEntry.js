import React from 'react';

const SpotTradeEntry = ({ legs, setLegs, minDate, maxDate, handleQuoteRequest, currencyOptions, onCurrencyChange }) => {
  const leg = legs[0] || {
    side: 'BUY',
    amount: '',
    currency: currencyOptions[0] || '',
    date: minDate
  };

  const updateLeg = (field, value) => {
    const updatedLeg = {
      ...leg,
      [field]: field === 'date' ? new Date(value) : value
    };
    setLegs([updatedLeg]);
  };

  return (
    <div className="trade-entry-row">
      <label>
        Side: <select value={leg.side} onChange={(e) => updateLeg('side', e.target.value)}>
          <option value="BUY">Buy</option>
          <option value="SELL">Sell</option>
        </select>
      </label>

      <label>
        Amount: <input type="number" value={leg.amount} onChange={(e) => updateLeg('amount', e.target.value)} />
      </label>

      <label>
        Currency: <select value={leg.currency} onChange={(e) => onCurrencyChange(e.target.value)}>
          {currencyOptions.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </label>

      <label>
        Date: <input
          type="date"
          value={leg.date ? leg.date.toISOString().substring(0, 10) : ''}
          onChange={(e) => updateLeg('date', e.target.value)}
          min={minDate.toISOString().substring(0, 10)}
          max={maxDate.toISOString().substring(0, 10)}
        />
      </label>

      <button onClick={handleQuoteRequest}>Request</button>
    </div>
  );
};

export default SpotTradeEntry;

