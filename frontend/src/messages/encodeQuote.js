if (typeof UnsafeBuffer === 'undefined') {
    var UnsafeBuffer = Java.type('org.agrona.concurrent.UnsafeBuffer');
}

// Import the SBE encoder classes
const QuoteEncoder = Java.type('agrona.messages.QuoteEncoder');
const DecimalEncoder = Java.type('agrona.messages.DecimalEncoder');
const MessageHeaderEncoder = Java.type('agrona.messages.MessageHeaderEncoder');

// Function to encode a Quote message
function encodeQuote(data) {
    console.log("Data received for encoding:", JSON.stringify(data));
    const byteArray = Java.type('byte[]');
    const buffer = new UnsafeBuffer(new byteArray(QuoteEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH));
    
    const encoder = new QuoteEncoder();
    const headerEncoder = new MessageHeaderEncoder();
    encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);

    // Encode the data
    console.log("Encoding...");
    encoder.amount().mantissa(data.amount.mantissa).exponent(data.amount.exponent);
    encoder.currency(data.currency);
    encoder.fxRate().mantissa(data.fxRate.mantissa).exponent(data.fxRate.exponent);
    encoder.transactTime(data.transactTime);
    encoder.side(data.side);
    encoder.symbol(data.symbol);
    encoder.quoteID(data.quoteID);
    encoder.quoteRequestID(data.quoteRequestID);

    return buffer.byteArray();
}

// Expose the function to JavaScript
Polyglot.export('encodeQuote', encodeQuote);
