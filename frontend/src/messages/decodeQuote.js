// Import necessary Java classes using GraalVM's Polyglot API
const Java = Polyglot.import('java');

// Import the SBE decoder classes
const QuoteDecoder = Java.type('agrona.QuoteDecoder');
const MessageHeaderDecoder = Java.type('agrona.MessageHeaderDecoder');
const UnsafeBuffer = Java.type('org.agrona.concurrent.UnsafeBuffer');

// Function to decode a Quote message
function decodeQuote(encodedMessage) {
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
        currency: Java.toJSArray(decoder.currency()).map(byte => String.fromCharCode(byte)).join(''),
        fxRate: {
            mantissa: decoder.fxRate().mantissa(),
            exponent: decoder.fxRate().exponent()
        },
        transactTime: Java.toJSArray(decoder.transactTime()).map(byte => String.fromCharCode(byte)).join(''),
        side: Java.toJSArray(decoder.side()).map(byte => String.fromCharCode(byte)).join(''),
        symbol: Java.toJSArray(decoder.symbol()).map(byte => String.fromCharCode(byte)).join(''),
        quoteID: Java.toJSArray(decoder.quoteID()).map(byte => String.fromCharCode(byte)).join(''),
        quoteRequestID: Java.toJSArray(decoder.quoteRequestID()).map(byte => String.fromCharCode(byte)).join('')
    };

    return result;
}

// Expose the function to JavaScript
Polyglot.export('decodeQuote', decodeQuote);
