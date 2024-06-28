if (typeof UnsafeBuffer === 'undefined') {
    var UnsafeBuffer = Java.type('org.agrona.concurrent.UnsafeBuffer');
}

// Import the SBE decoder classes
const ExecutionReportDecoder = Java.type('agrona.messages.ExecutionReportDecoder');
const MessageHeaderDecoder = Java.type('agrona.messages.MessageHeaderDecoder');

// Function to decode an ExecutionReport message
function decodeExecutionReport(encodedMessage) {
    console.log("Data received for decoding:", encodedMessage);
    const buffer = new UnsafeBuffer(encodedMessage);
    const headerDecoder = new MessageHeaderDecoder();
    const decoder = new ExecutionReportDecoder();

    headerDecoder.wrap(buffer, 0);
    decoder.wrapAndApplyHeader(buffer, 0, headerDecoder);

    const result = {
        amount: {
            mantissa: decoder.amount().mantissa(),
            exponent: decoder.amount().exponent()
        },
        currency: decoder.currency(),
        secondaryAmount: {
            mantissa: decoder.secondaryAmount().mantissa(),
            exponent: decoder.secondaryAmount().exponent()
        },
        secondaryCurrency: decoder.secondaryCurrency(),
        side: decoder.side(),
        symbol: decoder.symbol(),
        deliveryDate: decoder.deliveryDate(),
        transactTime: decoder.transactTime(),
        quoteRequestID: decoder.quoteRequestID(),
        quoteID: decoder.quoteID(),
        dealRequestID: decoder.dealRequestID(),
        dealID: decoder.dealID(),
        fxRate: {
            mantissa: decoder.fxRate().mantissa(),
            exponent: decoder.fxRate().exponent()
        }
    };

    return result;
}

Polyglot.export('decodeExecutionReport', decodeExecutionReport);
