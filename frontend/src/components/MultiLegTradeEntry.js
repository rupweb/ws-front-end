import React from 'react';

const MultiLegTradeEntry = ({ legs, setLegs, minDate, maxDate, handleQuoteRequest }) => {
  const updateLeg = (index, field, value) => {
    const updatedLegs = [...legs];
    updatedLegs[index] = {
      ...updatedLegs[index],
      [field]: field === 'date' ? new Date(value) : value
    };
    setLegs(updatedLegs);
  };

  const addLeg = () => {
    setLegs([
      ...legs,
      {
        side: 'SELL',
        amount: '',
        currency: legs[0]?.currency || 'USD',
        date: minDate
      }
    ]);
  };

  const removeLeg = (index) => {
    if (legs.length > 1) {
      const updatedLegs = [...legs];
      updatedLegs.splice(index, 1);
      setLegs(updatedLegs);
    }
  };

  return (
    <div>
      <h4>Multileg Trade</h4>
      {legs.map((leg, index) => (
        <div className="trade-entry-row" key={index}>
          <label>
            Side: <select value={leg.side} onChange={(e) => updateLeg(index, 'side', e.target.value)}>
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

          <button onClick={() => removeLeg(index)}>−</button>
        </div>
      ))}

      <div style={{ marginTop: '1rem' }}>
        <button onClick={addLeg}>+ Add Leg</button>
        <button onClick={handleQuoteRequest} style={{ marginLeft: '1rem' }}>
          Request
        </button>
      </div>
    </div>
  );
};

export default MultiLegTradeEntry;
