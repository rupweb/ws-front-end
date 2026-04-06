import { generateUUID } from '../utils/utils.js';
import encodeDealRequest from '../messages/encodeDealRequest.js'
import { format } from 'date-fns';
import { formatUtcTransactTime } from '../utils/transactTime.js';

const handleDealRequest = async ({
  amount,
  toCurrency,
  selectedDate,
  fxRate,
  secondaryAmount,
  symbol,
  quoteRequestID,
  quoteID,
  clientID,
  sendMessage
}) => {
  const resolvedClientID = (clientID || '').trim();
  console.log('Received clientID in handleDealRequest:', resolvedClientID);

  const dealRequest = {
    amount: {
      mantissa: Math.round(amount * Math.pow(10, 2)),
      exponent: -2
    },
    currency: toCurrency,
    side: 'BUY',
    symbol: symbol,
    deliveryDate: format(selectedDate, 'yyyyMMdd'),
    transactTime: formatUtcTransactTime(),
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
    },
    clientID: resolvedClientID
  };

  console.log('dealRequest:', dealRequest);

  // Encode the data using the JavaScript encoder
  const encodedMessage = encodeDealRequest(dealRequest);

  // Send the encoded message via WebSocket
  sendMessage(encodedMessage);
};

export default handleDealRequest;
