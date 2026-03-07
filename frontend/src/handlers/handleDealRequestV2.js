import { generateUUID } from '../utils/utils.js';
import encodeDealRequest from '../messages/encodeDealRequestV2.js'
import { format } from 'date-fns';

const mapTransactionType = (value) => (value === 'SWP' ? 'SWA' : value);

const handleDealRequestV2 = async ({
  transactionType, // 'SPO', 'FWD', 'SWP', 'MUL'
  symbol,
  clientID,
  quoteRequestID,
  quoteID,
  legs,
  sendMessage
}) => {
  const dealRequestID = generateUUID();
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
    valueDate: format(new Date(leg.date), 'yyyyMMdd'),
    spot: leg.spot || { mantissa: 0, exponent: -1 },
    fwd: leg.fwd || { mantissa: 0, exponent: -1 },
    price: leg.price || { mantissa: 0, exponent: -1 }
  }));

  const dealRequest = {
    transactionType: normalizedTransactionType,
    symbol,
    transactTime,
    messageTime,
    quoteRequestID,
    quoteID,
    dealRequestID,
    clientID,
    legs: formattedLegs
  };

  const encodedMessage = encodeDealRequest(dealRequest);
  sendMessage(encodedMessage);
};

export default handleDealRequestV2;
