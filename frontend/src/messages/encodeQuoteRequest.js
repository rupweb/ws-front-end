import QuoteRequestEncoder from './QuoteRequestEncoder.js';
import MessageHeaderEncoder from './MessageHeaderEncoder.js';

const encodeQuoteRequest = (data) => {
    const buffer = new ArrayBuffer(QuoteRequestEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH);
    const quoteRequestEncoder = new QuoteRequestEncoder();
    const messageHeaderEncoder = new MessageHeaderEncoder();

    // Wrap and apply header, then set data fields
    quoteRequestEncoder.wrapAndApplyHeader(buffer, 0, messageHeaderEncoder);

    // Now set each field individually
    quoteRequestEncoder.amount().mantissa(data.amount.mantissa).exponent(data.amount.exponent);
    quoteRequestEncoder.saleCurrency(data.saleCurrency);
    quoteRequestEncoder.side(data.side);
    quoteRequestEncoder.symbol(data.symbol);
    quoteRequestEncoder.deliveryDate(data.deliveryDate);
    quoteRequestEncoder.transactTime(data.transactTime);
    quoteRequestEncoder.quoteRequestID(data.quoteRequestID);
    quoteRequestEncoder.currencyOwned(data.currencyOwned);
    quoteRequestEncoder.kycStatus(data.kycStatus);

    return buffer;
};

export default encodeQuoteRequest;

