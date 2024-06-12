import { addBusinessDays } from '../utils/utils';

const handleReset = ({
  setFromCurrency,
  setToCurrency,
  setAmount,
  setSelectedDate,
  setShowExecute,
  setKycStatus
}) => {
  setFromCurrency('EUR');
  setToCurrency('USD');
  setAmount('');
  setSelectedDate(addBusinessDays(new Date(), 2));
  setShowExecute(false);
  setKycStatus('Not Started');
};

export default handleReset;
