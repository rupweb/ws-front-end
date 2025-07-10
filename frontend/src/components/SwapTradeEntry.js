import React from 'react';

const SwapTradeEntry = ({ legs, setLegs, minDate, maxDate, handleQuoteRequest }) => {
  const leg1 = legs[0] || { side: 'BUY', amount: '', currency: 'USD', date: minDate };
  const leg2 = legs[1] || { side: 'SELL', amount: '', currency: 'USD', date: minDate };

  const updateLeg = (index, field, value) => {
    const updatedLegs = [...legs];
    updatedLegs[index] = {
      ...updatedLegs[index],
      [field]: field === 'date' ? new Date(value) : value
    };
    // Automatically set the opposite side for the other leg
    if (field === 'side' && index === 0) {
      updatedLegs[1].side = value === 'BUY' ? 'SELL' : 'BUY';
    }
    setLegs(updatedLegs);
  };

  return (
    <div>
      <h4>Swap Legs</h4>
      {[leg1, leg2].map((leg, index) => (
        <div className="trade-entry-row" key={index}>
          <label>
            Side: <select
              value={leg.side}
              onChange={(e) => updateLeg(index, 'side', e.target.value)}
              disabled={index === 1}
            >
              <option value="BUY">Buy</option>
              <option value="SELL">Sell</option>
            </select>
          </label>

          <label>
            Amount: <input type="number" value={leg.amount} onChange={(e) => updateLeg(index, 'amount', e.target.value)} />
          </label>

          <label>
            Currency: <input type="text" value={leg.currency} onChange={(e) => updateLeg(index, 'currency', e.target.value.toUpperCase())} />
          </label>

          <label>
            Date: <input
              type="date"
              value={leg.date ? leg.date.toISOString().substring(0, 10) : ''}
              onChange={(e) => updateLeg(index, 'date', e.target.value)}
              min={minDate.toISOString().substring(0, 10)}
              max={maxDate.toISOString().substring(0, 10)}
            />
          </label>
        </div>
      ))}

      <button onClick={handleQuoteRequest}>Request</button>
    </div>
  );
};

export default SwapTradeEntry;

