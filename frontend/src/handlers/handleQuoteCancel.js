import encodeQuoteCancel from '../messages/encodeQuoteCancel.js';
import { format } from 'date-fns';

const handleQuoteCancel = async ({
  symbol,
  quoteRequestID,
  clientID,
  sendMessage
}) => {
  // Prepare the data to encode
  const cancelData = {
    symbol: symbol,
    transactTime: format(new Date(), 'yyyyMMdd-HH:mm:ss.SSS'),
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
