// Import necessary Java classes using GraalVM's Polyglot API
const Java = Polyglot.import('java');

// Import the SBE encoder classes
const DealRequestEncoder = Java.type('agrona.DealRequestEncoder');
const DecimalEncoder = Java.type('agrona.DecimalEncoder');
const MessageHeaderEncoder = Java.type('agrona.MessageHeaderEncoder');
const UnsafeBuffer = Java.type('org.agrona.concurrent.UnsafeBuffer');

// Function to encode a DealRequest message
function encodeDealRequest(data) {
    const buffer = new UnsafeBuffer(new byte[DealRequestEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH]);
    const encoder = new DealRequestEncoder();
    const headerEncoder = new MessageHeaderEncoder();
    encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);

    encoder.amount().mantissa(data.amount.mantissa).exponent(data.amount.exponent);
    encoder.currency(data.currency.getBytes('UTF-8'));
    encoder.side(data.side.getBytes('UTF-8'));
    encoder.symbol(data.symbol.getBytes('UTF-8'));
    encoder.deliveryDate(data.deliveryDate.getBytes('UTF-8'));
    encoder.transactTime(data.transactTime.getBytes('UTF-8'));
    encoder.quoteRequestID(data.quoteRequestID.getBytes('UTF-8'));
    encoder.quoteID(data.quoteID.getBytes('UTF-8'));
    encoder.dealRequestID(data.dealRequestID.getBytes('UTF-8'));
    encoder.ticketRef(data.ticketRef.getBytes('UTF-8'));
    encoder.fxRate().mantissa(data.fxRate.mantissa).exponent(data.fxRate.exponent);

    return buffer.byteArray();
}

// Expose the function to JavaScript
Polyglot.export('encodeDealRequest', encodeDealRequest);
