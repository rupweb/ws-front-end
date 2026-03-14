import TradeQuoteCancelEncoder from '../aeron/v2/TradeQuoteCancelEncoder.js';
import MessageHeaderEncoder from '../aeron/MessageHeaderEncoder.js';

const encodeQuoteCancelV2 = (data) => {
  const buffer = new ArrayBuffer(TradeQuoteCancelEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH);
  const headerEncoder = new MessageHeaderEncoder();
  const encoder = new TradeQuoteCancelEncoder();

  encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);
  encoder.header('');
  encoder.transactionType(data.transactionType);
  encoder.symbol(data.symbol);
  encoder.transactTime(data.transactTime);
  encoder.messageTime(data.messageTime);
  encoder.quoteRequestID(data.quoteRequestID);
  encoder.clientID(data.clientID);

  return buffer;
};

export default encodeQuoteCancelV2;

