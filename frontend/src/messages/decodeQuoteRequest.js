if (typeof UnsafeBuffer === 'undefined') {
    var UnsafeBuffer = Java.type('org.agrona.concurrent.UnsafeBuffer');
}

const QuoteRequestDecoder = Java.type('agrona.messages.QuoteRequestDecoder');
const MessageHeaderDecoder = Java.type('agrona.messages.MessageHeaderDecoder');

// Function to decode a QuoteRequest message
function decodeQuoteRequest(encodedMessage) {
    console.log("Data received for decoding:", encodedMessage);
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
        saleCurrency: decoder.saleCurrency(),
        side: decoder.side(),
        symbol: decoder.symbol(),
        deliveryDate: decoder.deliveryDate(),
        transactTime: decoder.transactTime(),
        quoteRequestID: decoder.quoteRequestID(),
        currencyOwned: decoder.currencyOwned(),
        kycStatus: decoder.kycStatus().toString()
    };

    return result;
}

Polyglot.export('decodeQuoteRequest', decodeQuoteRequest);
