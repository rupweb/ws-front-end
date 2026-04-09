import { generateUUID } from '../utils/utils.js';
import encodeDealRequest from '../messages/encodeDealRequestV2.js'
import { format } from 'date-fns';
import { formatUtcTransactTime } from '../utils/transactTime.js';
import {
  getExecutableTradeFwd,
  getExecutableTradePrice,
  getExecutableTradeSpot
} from '../utils/trading.js';

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
  const transactTime = formatUtcTransactTime();
  const normalizedTransactionType = mapTransactionType(transactionType);
  const fallbackCurrency = symbol?.length >= 6 ? symbol.substring(3, 6) : '';

  const asDecimal = (value) => {
    if (value && typeof value === 'object' && value.mantissa !== undefined && value.exponent !== undefined) {
      return value;
    }
    return { mantissa: 0, exponent: -1 };
  };

  const formattedLegs = legs.map((leg, index) => {
    const side = leg.side || (index === 0 ? 'BUY' : 'SELL');
    const quotedLeg = Array.isArray(quote?.legs) ? quote.legs[index] : null;
    const legCurrency = (leg.currency || quotedLeg?.currency || fallbackCurrency).toUpperCase();

    return {
      amount: {
        mantissa: Math.round(parseFloat(leg.amount || 0) * 100),
        exponent: -2
      },
      currency: legCurrency,
      side,
      valueDate: format(new Date(leg.date), 'yyyyMMdd'),
      // Use the executable leg values implied by side + quoted currency.
      spot: asDecimal(getExecutableTradeSpot({ quotedLeg, symbol, side, currency: legCurrency })),
      fwd: asDecimal(getExecutableTradeFwd({ quotedLeg, symbol, side, currency: legCurrency })),
      price: asDecimal(getExecutableTradePrice({ quotedLeg, symbol, side, currency: legCurrency }))
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
