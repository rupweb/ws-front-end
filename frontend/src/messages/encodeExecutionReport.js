if (typeof UnsafeBuffer === 'undefined') {
    var UnsafeBuffer = Java.type('org.agrona.concurrent.UnsafeBuffer');
}

// Import the SBE encoder classes
const ExecutionReportEncoder = Java.type('agrona.messages.ExecutionReportEncoder');
const DecimalEncoder = Java.type('agrona.messages.DecimalEncoder');
const MessageHeaderEncoder = Java.type('agrona.messages.MessageHeaderEncoder');

// Function to encode an ExecutionReport message
function encodeExecutionReport(data) {
    const byteArray = Java.type('byte[]');
    const buffer = new UnsafeBuffer(new byteArray(ExecutionReportEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH));
    
    const encoder = new ExecutionReportEncoder();
    const headerEncoder = new MessageHeaderEncoder();
    encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);

    // Encode the data
    console.log("Encoding...");   
    encoder.amount().mantissa(data.amount.mantissa).exponent(data.amount.exponent);
    encoder.currency(data.currency);
    encoder.secondaryAmount().mantissa(data.secondaryAmount.mantissa).exponent(data.secondaryAmount.exponent);
    encoder.secondaryCurrency(data.secondaryCurrency);
    encoder.side(data.side);
    encoder.symbol(data.symbol);
    encoder.deliveryDate(data.deliveryDate);
    encoder.transactTime(data.transactTime);
    encoder.quoteRequestID(data.quoteRequestID);
    encoder.quoteID(data.quoteID);
    encoder.dealRequestID(data.dealRequestID);
    encoder.dealID(data.dealID);
    encoder.fxRate().mantissa(data.fxRate.mantissa).exponent(data.fxRate.exponent);

    return buffer.byteArray();
}

// Expose the function to JavaScript
Polyglot.export('encodeExecutionReport', encodeExecutionReport);
