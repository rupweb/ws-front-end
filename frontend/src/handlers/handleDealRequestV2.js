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
  quote,
  legs,
  sendMessage
}) => {
  if (!quoteID || !quoteRequestID) {
    console.error('Missing quote identifiers; refusing to send deal request.');
    return;
  }

  const dealRequestID = generateUUID();
  const messageTime = BigInt(Date.now());
  const transactTime = format(new Date(), 'yyyyMMdd-HH:mm:ss.SSS');
  const normalizedTransactionType = mapTransactionType(transactionType);
  const fallbackCurrency = symbol?.length >= 6 ? symbol.substring(3, 6) : '';

  const asDecimal = (value) => {
    if (value && typeof value === 'object' && value.mantissa !== undefined && value.exponent !== undefined) {
      return value;
    }
    return { mantissa: 0, exponent: -1 };
  };

  const pickQuotedDecimal = (quotedLeg, buyField, sellField, side) => {
    const preferred = side === 'SELL' ? quotedLeg?.[sellField] : quotedLeg?.[buyField];
    return asDecimal(preferred);
  };

  const formattedLegs = legs.map((leg, index) => {
    const side = leg.side || (index === 0 ? 'BUY' : 'SELL');
    const quotedLeg = Array.isArray(quote?.legs) ? quote.legs[index] : null;

    return {
      amount: {
        mantissa: Math.round(parseFloat(leg.amount || 0) * 100),
        exponent: -2
      },
      currency: (leg.currency || quotedLeg?.currency || fallbackCurrency).toUpperCase(),
      side,
      valueDate: format(new Date(leg.date), 'yyyyMMdd'),
      // Use quoted leg prices for execution to avoid sending zero spot/fwd/price.
      spot: pickQuotedDecimal(quotedLeg, 'spotOffer', 'spotBid', side),
      fwd: pickQuotedDecimal(quotedLeg, 'fwdOffer', 'fwdBid', side),
      price: pickQuotedDecimal(quotedLeg, 'offer', 'bid', side)
    };
  });

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
