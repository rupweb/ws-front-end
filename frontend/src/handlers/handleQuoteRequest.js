import { generateUUID } from '../utils/utils.js';
import encodeQuoteRequest from '../messages/encodeQuoteRequest.js';

const handleQuoteRequest = async ({
  kycStatus,
  amount,
  setShowExecute,
  selectedDate,
  toCurrency,
  fromCurrency,
  sendMessage,
  handleKycCheck
}) => {
  const kycCheckResult = handleKycCheck(kycStatus, amount);
  if (kycCheckResult) return;

  // Prepare the data to encode
  const requestData = {
    amount: {
      mantissa: Math.round(amount * Math.pow(10, 2)),
      exponent: -2
    },
    saleCurrency: fromCurrency,
    side: 'BUY',
    symbol: `${fromCurrency}${toCurrency}`,
    deliveryDate: selectedDate.toISOString().slice(0, 10),
    transactTime: new Date().toISOString(),
    quoteRequestID: generateUUID(),
    currencyOwned: 'USD',
    kycStatus: 2 // Assuming 'VERIFIED' status corresponds to 2
  };

  // Encode the data using the JavaScript encoder
  const encodedMessage = encodeQuoteRequest(requestData);

  // Send the encoded message via WebSocket
  sendMessage(encodedMessage);

  setShowExecute(true);
};

export default handleQuoteRequest;