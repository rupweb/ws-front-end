// Load the Java classes using GraalVM's Polyglot API
const Java = Polyglot.import('java');
const QuoteRequestEncoder = Java.type('agrona.QuoteRequestEncoder');
const DecimalEncoder = Java.type('agrona.DecimalEncoder');
const MessageHeaderEncoder = Java.type('agrona.MessageHeaderEncoder');
const Buffer = Java.type('org.agrona.MutableDirectBuffer');
const UnsafeBuffer = Java.type('org.agrona.concurrent.UnsafeBuffer');

// Function to encode a QuoteRequest message
function encodeQuoteRequest(data) {
    const buffer = new UnsafeBuffer(new byte[QuoteRequestEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH]);

    // Create and wrap the encoder
    const encoder = new QuoteRequestEncoder();
    const headerEncoder = new MessageHeaderEncoder();
    encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);

    // Encode the data
    encoder.amount().mantissa(data.amount.mantissa).exponent(data.amount.exponent);
    encoder.saleCurrency(data.saleCurrency);
    encoder.deliveryDate(data.deliveryDate);
    encoder.transactTime(data.transactTime);
    encoder.quoteRequestID(data.quoteRequestID);
    encoder.side(data.side);
    encoder.symbol(data.symbol);
    encoder.currencyOwned(data.currencyOwned);
    encoder.kycStatus(data.kycStatus);

    return buffer.byteArray();
}

// Expose the function to JavaScript
Polyglot.export('encodeQuoteRequest', encodeQuoteRequest);
