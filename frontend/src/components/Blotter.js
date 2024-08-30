// Blotter.js
import React, { useEffect, useState } from 'react';
import '../css/Blotter.css';

const Blotter = () => {
  const [executions, setExecutions] = useState([]);

  useEffect(() => {
    const storedExecutions = JSON.parse(localStorage.getItem('executions')) || [];
    setExecutions(storedExecutions);
  }, []);

  const formatFxRate = (rate) => {
    const numericRate = Number(rate);
    return isNaN(numericRate) ? '' : numericRate.toFixed(7);
  };

  return (
    <div className="blotter-container">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Deal ID</th>
            <th>Sale Price</th>
            <th>Sale Currency</th>
            <th>Delivery Date</th>
            <th>Currency I Have</th>
            <th>FX Rate</th>
            <th>Amount to Pay</th>
          </tr>
        </thead>
        <tbody>
          {executions.map((trade, index) => (
            <tr key={index}>
              <td>{trade.date}</td>
              <td>{trade.dealID}</td>
              <td>{trade.salePrice}</td>
              <td>{trade.saleCurrency}</td>
              <td>{trade.deliveryDate}</td>
              <td>{trade.currencyIHave}</td>
              <td>{formatFxRate(trade.fxRate)}</td>
              <td>{trade.amountToPay}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Blotter;



