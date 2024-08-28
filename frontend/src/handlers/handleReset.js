import { addBusinessDays } from '../utils/utils.js';

const handleReset = ({
  setFromCurrency,
  setToCurrency,
  setAmount,
  setSelectedDate,
  setKycStatus,
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
  setKycStatus('Not Started');
  setQuote(null);
  setShowQuote(false);
  setExecutionReport(null);
  setShowExecutionReport(false);
  setError(null);
  setShowError(false);
};

export default handleReset;

