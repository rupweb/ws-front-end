import { addBusinessDays } from '../utils/utils.js';
import {
  EMPTY_ERROR,
  EMPTY_EXECUTION_REPORT,
  EMPTY_SALES_QUOTE
} from '../utils/trading.js';

const handleReset = ({
  setFromCurrency,
  setToCurrency,
  setAmount,
  setSelectedDate,
  setClientID,
  setQuote,
  setShowQuote,
  setExecutionReport,
  setShowExecutionReport,
  setError,
  setShowError
}) => {
  setFromCurrency('EUR');
  setToCurrency('USD');
  setAmount('');
  setSelectedDate(addBusinessDays(new Date(), 2));
  setClientID('');
  setQuote(EMPTY_SALES_QUOTE);
  setShowQuote(false);
  setExecutionReport(EMPTY_EXECUTION_REPORT);
  setShowExecutionReport(false);
  setError(EMPTY_ERROR);
  setShowError(false);
};

export default handleReset;

