import React, { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../css/Blotter.css';
import {
  formatBlotterExecutionDate,
  getStoredBlotterExecutions
} from '../utils/blotterStorage.js';

const TRANSACTION_TYPE_LABELS = {
  SPO: 'Spot',
  FWD: 'Forward',
  SWP: 'Swap',
  SWA: 'Swap',
  MUL: 'Multileg'
};

const Blotter = ({ view = 'sales' }) => {
  const [executions, setExecutions] = useState([]);

  useEffect(() => {
    setExecutions(getStoredBlotterExecutions());
  }, []);

  const formatFxRate = (rate) => {
    const numericRate = Number(rate);
    return isNaN(numericRate) ? '' : numericRate.toFixed(7);
  };

  const filteredExecutions = useMemo(
    () => executions.filter((execution) => execution.kind === view),
    [executions, view]
  );

  const formatTransactionType = (transactionType) => TRANSACTION_TYPE_LABELS[transactionType] || transactionType || '';

  const formatLegLine = (leg, index) => {
    const parts = [
      `L${index + 1}`,
      leg.side,
      leg.amount,
      leg.currency,
      leg.valueDate
    ].filter(Boolean);

    if (leg.price) {
      parts.push(`@ ${leg.price}`);
    }

    if (leg.spot) {
      parts.push(`spot ${leg.spot}`);
    }

    if (leg.fwd) {
      parts.push(`fwd ${leg.fwd}`);
    }

    if (leg.secondaryAmount || leg.secondaryCurrency) {
      parts.push(`${leg.secondaryAmount || ''} ${leg.secondaryCurrency || ''}`.trim());
    }

    return parts.join(' ');
  };

  const renderSalesTable = () => (
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
        {filteredExecutions.map((trade) => (
          <tr key={`${trade.kind}-${trade.dealID}`}>
            <td>{formatBlotterExecutionDate(trade)}</td>
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
  );

  const renderTradingTable = () => (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Date</th>
          <th>Deal ID</th>
          <th>Type</th>
          <th>Ccy</th>
          <th>Legs</th>
        </tr>
      </thead>
      <tbody>
        {filteredExecutions.map((trade) => (
          <tr key={`${trade.kind}-${trade.dealID}`}>
            <td>{formatBlotterExecutionDate(trade)}</td>
            <td>{trade.dealID}</td>
            <td>{formatTransactionType(trade.transactionType)}</td>
            <td>{trade.symbol}</td>
            <td className="blotter-legs-cell">
              {Array.isArray(trade.legs) && trade.legs.length > 0 ? trade.legs.map((leg, index) => (
                <span key={`${trade.dealID}-leg-${index}`} className="blotter-leg-line">
                  {formatLegLine(leg, index)}
                </span>
              )) : 'No leg details'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="blotter-container">
      <div className="blotter-header">
        <h2>{view === 'trading' ? 'Trading Blotter' : 'Sales Blotter'}</h2>
        <div className="blotter-nav" role="tablist" aria-label="Blotter views">
          <NavLink
            to="/blotter/sales"
            className={({ isActive }) => `blotter-nav-link${isActive ? ' active' : ''}`}
          >
            Sales
          </NavLink>
          <NavLink
            to="/blotter/trading"
            className={({ isActive }) => `blotter-nav-link${isActive ? ' active' : ''}`}
          >
            Trading
          </NavLink>
        </div>
      </div>
      {filteredExecutions.length === 0 ? (
        <div className="blotter-empty">No {view} executions yet.</div>
      ) : (
        view === 'trading' ? renderTradingTable() : renderSalesTable()
      )}
    </div>
  );
};

export default Blotter;



