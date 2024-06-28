if (typeof UnsafeBuffer === 'undefined') {
    var UnsafeBuffer = Java.type('org.agrona.concurrent.UnsafeBuffer');
}

const QuoteRequestEncoder = Java.type('agrona.messages.QuoteRequestEncoder');
const DecimalEncoder = Java.type('agrona.messages.DecimalEncoder');
const MessageHeaderEncoder = Java.type('agrona.messages.MessageHeaderEncoder');
const KycStatus = Java.type('agrona.messages.KycStatus');

// Function to encode a QuoteRequest message
function encodeQuoteRequest(data) {
    console.log("Data received for encoding:", JSON.stringify(data));
    const byteArray = Java.type('byte[]');
    const buffer = new UnsafeBuffer(new byteArray(QuoteRequestEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH));

    // Create and wrap the encoder
    const encoder = new QuoteRequestEncoder();
    const headerEncoder = new MessageHeaderEncoder();
    encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);

    // Encode the data
    console.log("Encoding...");
    encoder.amount().mantissa(data.amount.mantissa).exponent(data.amount.exponent);
    encoder.saleCurrency(data.saleCurrency);
    encoder.deliveryDate(data.deliveryDate);
    encoder.transactTime(data.transactTime);
    encoder.quoteRequestID(data.quoteRequestID);
    encoder.side(data.side);
    encoder.symbol(data.symbol);
    encoder.currencyOwned(data.currencyOwned);

    // kycStatus enum
    const kycStatusEnum = KycStatus.get(data.kycStatus);
    encoder.kycStatus(kycStatusEnum);

    return buffer.byteArray();
}

Polyglot.export('encodeQuoteRequest', encodeQuoteRequest);
