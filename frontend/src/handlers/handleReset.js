import { addBusinessDays } from '../utils/utils.js';

const handleReset = ({
  setFromCurrency,
  setToCurrency,
  setAmount,
  setSelectedDate,
  setShowExecute,
  setKycStatus,
  setQuoteData,
  setShowQuote
}) => {
  setFromCurrency('EUR');
  setToCurrency('USD');
  setAmount('');
  setSelectedDate(addBusinessDays(new Date(), 2));
  setShowExecute(false);
  setKycStatus('Not Started');
  setQuoteData({
    fxRate: null,
    secondaryAmount: null,
    symbol: ''
  });
  setShowQuote(false);
};

export default handleReset;

