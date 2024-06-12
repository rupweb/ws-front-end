import { generateUUID } from '../utils/utils';

const handleExecute = async ({
  amount,
  toCurrency,
  selectedDate,
  fromCurrency,
  conversionRate,
  convertedAmount,
  sendMessage,
  handleExecutionMessage,
  handleReset,
  kycStatus
}) => {
  const execution = {
    date: new Date().toLocaleDateString(),
    salePrice: amount,
    saleCurrency: toCurrency,
    deliveryDate: selectedDate.toLocaleDateString(),
    currencyIHave: fromCurrency,
    fxRate: conversionRate,
    amountToPay: convertedAmount.toFixed(2),
  };

  const executions = JSON.parse(localStorage.getItem('executions')) || [];
  executions.push(execution);
  localStorage.setItem('executions', JSON.stringify(executions));

  const dealRequest = {
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

  await sendMessage('dealRequest', dealRequest);

  handleExecutionMessage({
    salePrice: amount,
    saleCurrency: toCurrency,
    deliveryDate: selectedDate.toLocaleDateString(),
    currencyIHave: fromCurrency,
    fxRate: conversionRate,
    amountToPay: convertedAmount.toFixed(2),
  });

  handleReset();
};

export default handleExecute;
