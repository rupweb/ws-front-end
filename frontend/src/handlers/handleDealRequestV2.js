import { generateUUID } from '../utils/utils.js';
import encodeDealRequest from '../messages/encodeDealRequestV2.js'
import { format } from 'date-fns';

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

  const formattedLegs = legs.map(leg => ({
    amount: {
      mantissa: Math.round(parseFloat(leg.amount) * 100),
      exponent: -2
    },
    currency: leg.currency,
    side: leg.side,
    valueDate: format(new Date(leg.date), 'yyyyMMdd'),
    spot: leg.spot || { mantissa: 0, exponent: -1 },
    fwd: leg.fwd || { mantissa: 0, exponent: -1 },
    price: leg.price || { mantissa: 0, exponent: -1 }
  }));

  const dealRequest = {
    transactionType,
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
