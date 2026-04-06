import encodeQuoteCancelV2 from '../messages/encodeQuoteCancelV2.js';
import { formatUtcTransactTime } from '../utils/transactTime.js';

const mapTransactionType = (value) => (value === 'SWP' ? 'SWA' : value);

const handleQuoteCancelV2 = async ({
  transactionType,
  symbol,
  quoteRequestID,
  clientID,
  sendMessage
}) => {
  const cancelData = {
    transactionType: mapTransactionType(transactionType || ''),
    symbol: symbol || '',
    transactTime: formatUtcTransactTime(),
    messageTime: BigInt(Date.now()),
    quoteRequestID: quoteRequestID || '',
    clientID: clientID || ''
  };

  console.log('Send tradeQuoteCancel:', cancelData);

  const encodedMessage = encodeQuoteCancelV2(cancelData);
  sendMessage(encodedMessage);
};

export default handleQuoteCancelV2;

