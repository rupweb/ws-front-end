if (typeof UnsafeBuffer === 'undefined') {
    var UnsafeBuffer = Java.type('org.agrona.concurrent.UnsafeBuffer');
}

// Import the SBE decoder classes
const QuoteDecoder = Java.type('agrona.messages.QuoteDecoder');
const MessageHeaderDecoder = Java.type('agrona.messages.MessageHeaderDecoder');

// Function to decode a Quote message
function decodeQuote(encodedMessage) {
    console.log("Data received for decoding:", encodedMessage);
    const buffer = new UnsafeBuffer(encodedMessage);
    const headerDecoder = new MessageHeaderDecoder();
    const decoder = new QuoteDecoder();

    headerDecoder.wrap(buffer, 0);
    decoder.wrapAndApplyHeader(buffer, 0, headerDecoder);

    const result = {
        amount: {
            mantissa: decoder.amount().mantissa(),
            exponent: decoder.amount().exponent()
        },
        currency: decoder.currency(),
        side: decoder.side(),
        symbol: decoder.symbol(),
        transactTime: decoder.transactTime(),
        quoteID: decoder.quoteID(),
        quoteRequestID: decoder.quoteRequestID(),
        fxRate: {
            mantissa: decoder.fxRate().mantissa(),
            exponent: decoder.fxRate().exponent()
        }
    };

    return result;
}

Polyglot.export('decodeQuote', decodeQuote);
