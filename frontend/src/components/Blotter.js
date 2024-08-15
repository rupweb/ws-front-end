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
            <th>Sale Price</th>
            <th>Sale Currency</th>
            <th>Delivery Date</th>
            <th>Currency I Have</th>
            <th>FX Rate</th>
            <th>Amount to Pay</th>
          </tr>
        </thead>
        <tbody>
          {executions.map((execution, index) => (
            <tr key={index}>
              <td>{execution.date}</td>
              <td>{execution.salePrice}</td>
              <td>{execution.saleCurrency}</td>
              <td>{execution.deliveryDate}</td>
              <td>{execution.currencyIHave}</td>
              <td>{formatFxRate(execution.fxRate)}</td>
              <td>{execution.amountToPay}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Blotter;



