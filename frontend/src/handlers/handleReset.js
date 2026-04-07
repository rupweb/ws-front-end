import { addBusinessDays } from '../utils/utils.js';

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
  setQuote({
    fxRate: 0,
    secondaryAmount: 0,
    symbol: '',
    quoteRequestID: '',
    quoteID: '',
    clientID: ''
  });
  setShowQuote(false);
  setExecutionReport({
    kind: '',
    executedAt: '',
    dealID: '',
    transactionType: '',
    amount: null,
    currency: '',
    symbol: '',
    deliveryDate: '',
    secondaryCurrency: '',
    rate: null,
    secondaryAmount: null,
    legs: []
  });
  setShowExecutionReport(false);
  setError(null);
  setShowError(false);
};

export default handleReset;

