import { generateUUID } from '../utils/utils.js';
import encodeDealRequest from '../messages/encodeDealRequest.js';
import { format } from 'date-fns';

const handleDealRequest = async ({
  amount,
  toCurrency,
  selectedDate,
  fromCurrency,
  fxRate,
  secondaryAmount,
  symbol,
  quoteRequestID,
  quoteID,
  sendMessage
}) => {
  const execution = {
    date: new Date().toLocaleDateString(),
    salePrice: amount,
    saleCurrency: toCurrency,
    symbol: symbol,
    deliveryDate: selectedDate.toLocaleDateString(),
    currencyIHave: fromCurrency,
    fxRate: fxRate,
    amountToPay: secondaryAmount,
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
    symbol: symbol,
    deliveryDate: format(selectedDate, 'yyyyMMdd'),
    transactTime: format(new Date(), 'yyyyMMdd-HH:mm:ss.SSS'),
    quoteRequestID: quoteRequestID,
    quoteID: quoteID,
    dealRequestID: generateUUID(),
    fxRate: {
      mantissa: Math.round(fxRate * Math.pow(10, 5)),
      exponent: -5
    },
    secondaryAmount: {
      mantissa: Math.round(secondaryAmount * Math.pow(10, 2)),
      exponent: -2
    }
  };

  // Encode the data using the JavaScript encoder
  const encodedMessage = encodeDealRequest(dealRequest);

  // Send the encoded message via WebSocket
  sendMessage(encodedMessage);
};

export default handleDealRequest;
