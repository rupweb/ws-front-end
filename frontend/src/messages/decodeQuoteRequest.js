// Import necessary Java classes using GraalVM's Polyglot API
const Java = Polyglot.import('java');

// Import the SBE decoder classes
const QuoteRequestDecoder = Java.type('agrona.QuoteRequestDecoder');
const MessageHeaderDecoder = Java.type('agrona.MessageHeaderDecoder');
const UnsafeBuffer = Java.type('org.agrona.concurrent.UnsafeBuffer');

// Function to decode a QuoteRequest message
function decodeQuoteRequest(encodedMessage) {
    const buffer = new UnsafeBuffer(encodedMessage);
    const headerDecoder = new MessageHeaderDecoder();
    const decoder = new QuoteRequestDecoder();

    headerDecoder.wrap(buffer, 0);
    decoder.wrapAndApplyHeader(buffer, 0, headerDecoder);

    const result = {
        amount: {
            mantissa: decoder.amount().mantissa(),
            exponent: decoder.amount().exponent()
        },
        saleCurrency: Java.toJSArray(decoder.saleCurrency()).map(byte => String.fromCharCode(byte)).join(''),
        deliveryDate: Java.toJSArray(decoder.deliveryDate()).map(byte => String.fromCharCode(byte)).join(''),
        transactTime: Java.toJSArray(decoder.transactTime()).map(byte => String.fromCharCode(byte)).join(''),
        quoteRequestID: Java.toJSArray(decoder.quoteRequestID()).map(byte => String.fromCharCode(byte)).join(''),
        side: Java.toJSArray(decoder.side()).map(byte => String.fromCharCode(byte)).join(''),
        symbol: Java.toJSArray(decoder.symbol()).map(byte => String.fromCharCode(byte)).join(''),
        currencyOwned: Java.toJSArray(decoder.currencyOwned()).map(byte => String.fromCharCode(byte)).join(''),
        kycStatus: decoder.kycStatus().toString()
    };

    return result;
}

// Expose the function to JavaScript
Polyglot.export('decodeQuoteRequest', decodeQuoteRequest);
