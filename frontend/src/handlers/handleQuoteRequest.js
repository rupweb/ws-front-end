import { generateUUID } from '../utils/utils.js';
import encodeQuoteRequest from '../messages/encodeQuoteRequest.js';
import { format } from 'date-fns';

const handleQuoteRequest = async ({
  kycStatus,
  amount,
  selectedDate,
  toCurrency,
  fromCurrency,
  sendMessage,
  handleKycCheck,
  setShowQuote,
  setShowExecute
}) => {
  const kycCheckResult = handleKycCheck(kycStatus, amount);
  if (kycCheckResult) return;

  // Prepare the data to encode
  const requestData = {
    amount: {
      mantissa: Math.round(amount * Math.pow(10, 2)),
      exponent: -2
    },
    saleCurrency: toCurrency,
    side: 'BUY',
    symbol: `${fromCurrency}${toCurrency}`,
    deliveryDate: format(selectedDate, 'yyyyMMdd'),
    transactTime: format(new Date(), 'yyyyMMdd-HH:mm:ss.SSS'),
    quoteRequestID: generateUUID(),
    currencyOwned: fromCurrency,
    kycStatus: kycStatus
  };

  // Encode the data using the JavaScript encoder
  const encodedMessage = encodeQuoteRequest(requestData);

  // Send the encoded message via WebSocket
  sendMessage(encodedMessage);

  setShowQuote(true);
  setShowExecute(true);
};

export default handleQuoteRequest;
