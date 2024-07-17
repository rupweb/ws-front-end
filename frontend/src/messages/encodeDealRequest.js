if (typeof UnsafeBuffer === 'undefined') {
    var UnsafeBuffer = Java.type('org.agrona.concurrent.UnsafeBuffer');
}

const DealRequestEncoder = Java.type('agrona.messages.DealRequestEncoder');
const DecimalEncoder = Java.type('agrona.messages.DecimalEncoder');
const MessageHeaderEncoder = Java.type('agrona.messages.MessageHeaderEncoder');

// Function to encode a DealRequest message
function encodeDealRequest(data) {
    console.log("Data received for encoding:", JSON.stringify(data));
    const byteArray = Java.type('byte[]');
    const buffer = new UnsafeBuffer(new byteArray(MessageHeaderEncoder.ENCODED_LENGTH + DealRequestEncoder.BLOCK_LENGTH));
    
    const encoder = new DealRequestEncoder();
    const headerEncoder = new MessageHeaderEncoder();
    encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);

    // Encode the data
    console.log("Encoding...");
    encoder.amount().wrap(buffer, encoder.amount().offset()).mantissa(data.amount.mantissa).exponent(data.amount.exponent);
    encoder.currency(data.currency);
    encoder.side(data.side);
    encoder.symbol(data.symbol);
    encoder.deliveryDate(data.deliveryDate);
    encoder.transactTime(data.transactTime);
    encoder.quoteRequestID(data.quoteRequestID);
    encoder.quoteID(data.quoteID);
    encoder.dealRequestID(data.dealRequestID);
    encoder.fxRate().wrap(buffer, encoder.fxRate().offset()).mantissa(data.fxRate.mantissa).exponent(data.fxRate.exponent);

    return buffer.byteArray();
}

Polyglot.export('encodeDealRequest', encodeDealRequest);
