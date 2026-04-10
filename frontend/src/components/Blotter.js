import React, { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../css/Blotter.css';
import {
  formatBlotterExecutionDate,
  getBlotterExecutionTimestamp,
  getStoredBlotterExecutions
} from '../utils/blotterStorage.js';

const TRANSACTION_TYPE_LABELS = {
  SPO: 'Spot',
  FWD: 'Forward',
  SWP: 'Swap',
  SWA: 'Swap',
  MUL: 'Multileg'
};

const SALES_COLUMNS = [
  { key: 'date', label: 'Date', type: 'date' },
  { key: 'dealID', label: 'Deal ID', type: 'text' },
  { key: 'salePrice', label: 'Sale Price', type: 'number' },
  { key: 'saleCurrency', label: 'Sale Currency', type: 'text' },
  { key: 'deliveryDate', label: 'Delivery Date', type: 'number' },
  { key: 'currencyIHave', label: 'Currency I Have', type: 'text' },
  { key: 'fxRate', label: 'FX Rate', type: 'number' },
  { key: 'amountToPay', label: 'Amount to Pay', type: 'number' }
];

const TRADING_COLUMNS = [
  { key: 'date', label: 'Date', type: 'date' },
  { key: 'dealID', label: 'Deal ID', type: 'text' },
  { key: 'transactionType', label: 'Type', type: 'text' },
  { key: 'symbol', label: 'Ccy', type: 'text' },
  { key: 'legs', label: 'Legs', type: 'legs' }
];

const DEFAULT_SALES_SORT = {
  key: 'date',
  direction: 'desc'
};

const DEFAULT_TRADING_SORT = {
  key: 'date',
  direction: 'desc'
};

const Blotter = ({ view = 'sales' }) => {
  const [executions, setExecutions] = useState([]);
  const [salesSort, setSalesSort] = useState(DEFAULT_SALES_SORT);
  const [tradingSort, setTradingSort] = useState(DEFAULT_TRADING_SORT);

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

  const getComparableValue = (trade, column) => {
    if (column.key === 'date') {
      return getBlotterExecutionTimestamp(trade);
    }

    if (column.type === 'number') {
      const numericValue = Number(trade[column.key]);
      return Number.isNaN(numericValue) ? null : numericValue;
    }

    if (column.type === 'legs') {
      return Array.isArray(trade.legs)
        ? trade.legs.map((leg, index) => formatLegLine(leg, index)).join(' ')
        : '';
    }

    return `${trade[column.key] || ''}`.toLowerCase();
  };

  const sortExecutions = (items, columns, sortState) => {
    const activeColumn = columns.find((column) => column.key === sortState.key) || columns[0];
    const directionMultiplier = sortState.direction === 'asc' ? 1 : -1;

    return [...items].sort((left, right) => {
      const leftValue = getComparableValue(left, activeColumn);
      const rightValue = getComparableValue(right, activeColumn);

      if (leftValue == null && rightValue == null) {
        return 0;
      }

      if (leftValue == null) {
        return 1;
      }

      if (rightValue == null) {
        return -1;
      }

      if (activeColumn.type === 'text') {
        return leftValue.localeCompare(rightValue) * directionMultiplier;
      }

      if (leftValue === rightValue) {
        return 0;
      }

      return (leftValue < rightValue ? -1 : 1) * directionMultiplier;
    });
  };

  const sortedSalesExecutions = useMemo(
    () => sortExecutions(filteredExecutions, SALES_COLUMNS, salesSort),
    [filteredExecutions, salesSort]
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

  const sortedTradingExecutions = useMemo(
    () => sortExecutions(filteredExecutions, TRADING_COLUMNS, tradingSort),
    [filteredExecutions, tradingSort]
  );

  const toggleSort = (currentSort, columnKey) => (
    currentSort.key === columnKey
      ? {
          key: columnKey,
          direction: currentSort.direction === 'asc' ? 'desc' : 'asc'
        }
      : {
          key: columnKey,
          direction: 'asc'
        }
  );

  const handleSalesSort = (columnKey) => {
    setSalesSort((currentSort) => (
      toggleSort(currentSort, columnKey)
    ));
  };

  const handleTradingSort = (columnKey) => {
    setTradingSort((currentSort) => (
      toggleSort(currentSort, columnKey)
    ));
  };

  const getHeaderSortState = (sortState, columnKey) => {
    if (sortState.key !== columnKey) {
      return 'none';
    }

    return sortState.direction === 'asc' ? 'ascending' : 'descending';
  };

  const renderSortableHeader = (column, sortState, onSort) => {
    const ariaSort = getHeaderSortState(sortState, column.key);
    const isActive = ariaSort !== 'none';

    return (
      <th key={column.key} aria-sort={ariaSort}>
        <button
          type="button"
          className={[
            'blotter-sort-button',
            isActive ? 'is-sorted' : '',
            ariaSort === 'ascending' ? 'is-ascending' : ''
          ].filter(Boolean).join(' ')}
          onClick={() => onSort(column.key)}
        >
          {column.label}
        </button>
      </th>
    );
  };

  const renderSalesTable = () => (
    <table className="table table-striped">
      <thead>
        <tr>
          {SALES_COLUMNS.map((column) => renderSortableHeader(column, salesSort, handleSalesSort))}
        </tr>
      </thead>
      <tbody>
        {sortedSalesExecutions.map((trade) => (
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
          {TRADING_COLUMNS.map((column) => renderSortableHeader(column, tradingSort, handleTradingSort))}
        </tr>
      </thead>
      <tbody>
        {sortedTradingExecutions.map((trade) => (
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



