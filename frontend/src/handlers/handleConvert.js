import { generateUUID } from '../utils/utils';

const handleConvert = async ({
  kycStatus,
  amount,
  convert,
  setShowExecute,
  selectedDate,
  toCurrency,
  fromCurrency,
  sendMessage,
  handleKycCheck
}) => {
  const kycCheckResult = handleKycCheck(kycStatus, amount);
  if (kycCheckResult) return;

  convert();
  setShowExecute(true);

  const quoteRequest = {
    salePrice: amount,
    saleCurrency: toCurrency,
    deliveryDate: selectedDate.toISOString().split('T')[0],
    transactTime: new Date().toISOString(),
    quoteRequestID: generateUUID(),
    side: 'BUY',
    symbol: `${fromCurrency}/${toCurrency}`,
    currencyOwned: fromCurrency,
    kycStatus,
  };

  await sendMessage('quoteRequest', quoteRequest);
};

export default handleConvert;
