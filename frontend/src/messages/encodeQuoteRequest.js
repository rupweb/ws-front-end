import QuoteRequestEncoder from '../aeron/v1/QuoteRequestEncoder.js'
import MessageHeaderEncoder from '../aeron/MessageHeaderEncoder.js';

const encodeQuoteRequest = (data) => {
    const buffer = new ArrayBuffer(QuoteRequestEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH);
    const headerEncoder = new MessageHeaderEncoder();
    const encoder = new QuoteRequestEncoder();

    // Encode the data
    encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);
    encoder.encodeamount(data.amount);
    encoder.saleCurrency(data.saleCurrency);
    encoder.side(data.side);
    encoder.symbol(data.symbol);
    encoder.deliveryDate(data.deliveryDate);
    encoder.transactTime(data.transactTime);
    encoder.quoteRequestID(data.quoteRequestID);
    encoder.currencyOwned(data.currencyOwned);
    encoder.clientID(data.clientID);

    return buffer;
};

export default encodeQuoteRequest;

