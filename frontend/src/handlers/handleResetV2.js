import { addBusinessDays } from '../utils/utils.js';
import {
  EMPTY_ERROR,
  EMPTY_EXECUTION_REPORT,
  EMPTY_TRADING_QUOTE,
  getDefaultTradeCurrency
} from '../utils/trading.js';

const handleReset = ({
  setQuote,
  setShowQuote,
  setExecutionReport,
  setShowExecutionReport,
  setError,
  setShowError,
  setLegs,
  setSymbol,
  setTransactionType,
  setClientID
}) => {
  const defaultSymbol = 'EURUSD';
  const defaultQuoteCurrency = getDefaultTradeCurrency(defaultSymbol);
  const nearDate = addBusinessDays(new Date(), 2);
  setTransactionType('SPO');
  setSymbol(defaultSymbol);
  setLegs([
    {
      side: 'BUY',
      amount: '',
      currency: defaultQuoteCurrency,
      date: nearDate
    }
  ]);
  if (setClientID) {
    setClientID('');
  }
  setQuote(EMPTY_TRADING_QUOTE);
  setShowQuote(false);
  setExecutionReport(EMPTY_EXECUTION_REPORT);
  setShowExecutionReport(false);
  setError(EMPTY_ERROR);
  setShowError(false);
};

export default handleReset;

