import encodeQuoteCancel from '../messages/encodeQuoteCancel.js';
import { formatUtcTransactTime } from '../utils/transactTime.js';

const handleQuoteCancel = async ({
  symbol,
  quoteRequestID,
  clientID,
  sendMessage
}) => {
  // Prepare the data to encode
  const cancelData = {
    symbol: symbol,
    transactTime: formatUtcTransactTime(),
    quoteRequestID: quoteRequestID,
    clientID: clientID
  };

  console.log('Send quoteCancel:', cancelData);

  // Encode the data using the JavaScript encoder
  const encodedMessage = encodeQuoteCancel(cancelData);

  // Send the encoded message via WebSocket
  sendMessage(encodedMessage);
};

export default handleQuoteCancel;
