import QuoteCancelEncoder from '../aeron/v1/QuoteCancelEncoder.js'
import MessageHeaderEncoder from '../aeron/MessageHeaderEncoder.js';

const encodeQuoteCancel = (data) => {
    const buffer = new ArrayBuffer(QuoteCancelEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH);
    const headerEncoder = new MessageHeaderEncoder();
    const encoder = new QuoteCancelEncoder();

    // Encode the data
    encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);
    encoder.symbol(data.symbol);
    encoder.transactTime(data.transactTime);
    encoder.quoteRequestID(data.quoteRequestID);
    encoder.clientID(data.clientID);

    return buffer;
};

export default encodeQuoteCancel;

