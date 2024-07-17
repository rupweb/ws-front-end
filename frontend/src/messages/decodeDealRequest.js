if (typeof UnsafeBuffer === 'undefined') {
    var UnsafeBuffer = Java.type('org.agrona.concurrent.UnsafeBuffer');
}

// Import the SBE decoder classes
const DealRequestDecoder = Java.type('agrona.messages.DealRequestDecoder');
const MessageHeaderDecoder = Java.type('agrona.messages.MessageHeaderDecoder');

// Function to decode a DealRequest message
function decodeDealRequest(encodedMessage) {
    console.log("Data received for decoding:", encodedMessage);
    const buffer = new UnsafeBuffer(encodedMessage);
    const headerDecoder = new MessageHeaderDecoder();
    const decoder = new DealRequestDecoder();

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
        deliveryDate: decoder.deliveryDate(),
        transactTime: decoder.transactTime(),
        quoteRequestID: decoder.quoteRequestID(),
        quoteID: decoder.quoteID(),
        dealRequestID: decoder.dealRequestID(),
        fxRate: {
            mantissa: decoder.fxRate().mantissa(),
            exponent: decoder.fxRate().exponent()
        }
    };

    return result;
}

// Expose the function to JavaScript
Polyglot.export('decodeDealRequest', decodeDealRequest);
