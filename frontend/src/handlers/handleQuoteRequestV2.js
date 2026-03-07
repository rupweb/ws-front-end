import { generateUUID } from '../utils/utils.js';
import encodeQuoteRequest from '../messages/encodeQuoteRequestV2.js';
import { format } from 'date-fns';

const mapTransactionType = (value) => (value === 'SWP' ? 'SWA' : value);

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
  const normalizedTransactionType = mapTransactionType(transactionType);
  const fallbackCurrency = symbol?.length >= 6 ? symbol.substring(3, 6) : '';

  const formattedLegs = legs.map((leg, index) => ({
    amount: {
      mantissa: Math.round(parseFloat(leg.amount || 0) * 100),
      exponent: -2
    },
    currency: (leg.currency || fallbackCurrency).toUpperCase(),
    side: leg.side || (index === 0 ? 'BUY' : 'SELL'),
    valueDate: format(new Date(leg.date), 'yyyyMMdd')
  }));

  const requestData = {
    transactionType: normalizedTransactionType,
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
