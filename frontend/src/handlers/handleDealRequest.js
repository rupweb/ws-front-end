import { generateUUID } from '../utils/utils.js';
import encodeDealRequest from '../messages/encodeDealRequest.js';

const handleDealRequest = async ({
  amount,
  toCurrency,
  selectedDate,
  fromCurrency,
  conversionRate,
  convertedAmount,
  sendMessage,
  handleExecutionMessage,
  handleReset
}) => {
  if (!convertedAmount || !conversionRate) {
    console.error('Conversion amount or rate is missing');
    return;
  }

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
    amount: {
      mantissa: Math.round(amount * Math.pow(10, 2)),
      exponent: -2
    },
    currency: toCurrency,
    side: 'BUY',
    symbol: `${fromCurrency}/${toCurrency}`,
    deliveryDate: selectedDate.toISOString().split('T')[0],
    transactTime: new Date().toISOString(),
    quoteRequestID: generateUUID(),
    quoteID: generateUUID(), // Assuming you generate a new UUID for the quote ID as well
    dealRequestID: generateUUID(),
    fxRate: {
      mantissa: Math.round(conversionRate * Math.pow(10, 6)),
      exponent: -6
    }
  };

  // Encode the data using the JavaScript encoder
  const encodedMessage = encodeDealRequest(dealRequest);

  // Send the encoded message via WebSocket
  sendMessage(encodedMessage);

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

export default handleDealRequest;
