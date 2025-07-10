import { generateUUID } from '../utils/utils.js';
import encodeQuoteRequest from '../messages/encodeQuoteRequestV2.js';
import { format } from 'date-fns';

const handleQuoteRequestV2 = async ({
  transactionType, // 'SPO', 'FWD', 'SWP', 'MUL'
  symbol,
  clientID,
  legs,
  sendMessage,
  handleClientIDCheck
}) => {
  const totalAmount = legs.reduce((sum, leg) => sum + parseFloat(leg.amount || 0), 0);
  const clientIDCheckResult = handleClientIDCheck(clientID, totalAmount);
  if (clientIDCheckResult) return;

  const quoteRequestID = generateUUID();
  const messageTime = BigInt(Date.now());
  const transactTime = format(new Date(), 'yyyyMMdd-HH:mm:ss.SSS');

  const formattedLegs = legs.map(leg => ({
    amount: {
      mantissa: Math.round(parseFloat(leg.amount) * 100),
      exponent: -2
    },
    currency: leg.currency,
    side: leg.side,
    valueDate: format(new Date(leg.date), 'yyyyMMdd')
  }));

  const requestData = {
    transactionType,
    symbol,
    transactTime,
    messageTime,
    quoteRequestID,
    clientID,
    legs: formattedLegs
  };

  const encodedMessage = encodeQuoteRequest(requestData);
  sendMessage(encodedMessage);
};

export default handleQuoteRequestV2;
