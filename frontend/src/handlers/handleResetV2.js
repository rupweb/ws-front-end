import { addBusinessDays } from '../utils/utils.js';

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
  const defaultQuoteCurrency = defaultSymbol.substring(3, 6);
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
  setQuote({
    quoteRequestID: '',
    quoteID: '',
    clientID: '',
    symbol: '',
    legs: [],
    fxRate: null,
    secondaryAmount: null,
    currency: ''
  });
  setShowQuote(false);
  setExecutionReport({
    dealID: '',
    amount: null,
    currency: '',
    symbol: '',
    deliveryDate: '',
    secondaryCurrency: '',
    rate: null,
    secondaryAmount: null
  });
  setShowExecutionReport(false);
  setError({
    amount: null,
    currency: '',
    side: '',
    symbol: '',
    deliveryDate: '',
    transactTime: '',
    quoteRequestID: '',
    quoteID: '',
    dealRequestID: '',
    dealID: '',
    rate: null,
    secondaryAmount: null,
    clientID: '',
    message: ''
  });
  setShowError(false);
};

export default handleReset;

