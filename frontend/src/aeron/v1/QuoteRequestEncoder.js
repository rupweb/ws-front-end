import DecimalEncoder from '../DecimalEncoder.js';
import MessageHeaderEncoder from '../MessageHeaderEncoder.js';

class QuoteRequestEncoder {
    static BLOCK_LENGTH = 82;
    static TEMPLATE_ID = 3;
    static SCHEMA_ID = 1;
    static SCHEMA_VERSION = 1;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.buffer = null;
        this.offset = 0;
        this.amountEncoder = new DecimalEncoder();
    }

    wrap(buffer, offset) {
        this.buffer = new DataView(buffer);
        this.offset = offset + 8; // Add the header again? The first field starts at 16
        return this;
    }

    wrapAndApplyHeader(buffer, offset, headerEncoder) {
        headerEncoder.wrap(buffer, offset)
            .blockLength(QuoteRequestEncoder.BLOCK_LENGTH)
            .templateId(QuoteRequestEncoder.TEMPLATE_ID)
            .schemaId(QuoteRequestEncoder.SCHEMA_ID)
            .version(QuoteRequestEncoder.SCHEMA_VERSION);
        return this.wrap(buffer, offset + MessageHeaderEncoder.ENCODED_LENGTH);
    }

    encodeamount(value) {
        this.amountEncoder.wrap(this.buffer.buffer, this.offset + 0);
        this.amountEncoder.mantissa(value.mantissa);
        this.amountEncoder.exponent(value.exponent);
    }

    // Encode saleCurrency
    saleCurrency(value) {
        this.putString(this.offset + 9, value, 3);
        return this;
    }

    // Encode side
    side(value) {
        this.putString(this.offset + 12, value, 4);
        return this;
    }

    // Encode symbol
    symbol(value) {
        this.putString(this.offset + 16, value, 6);
        return this;
    }

    // Encode deliveryDate
    deliveryDate(value) {
        this.putString(this.offset + 22, value, 8);
        return this;
    }

    // Encode transactTime
    transactTime(value) {
        this.putString(this.offset + 30, value, 21);
        return this;
    }

    // Encode quoteRequestID
    quoteRequestID(value) {
        this.putString(this.offset + 51, value, 16);
        return this;
    }

    // Encode currencyOwned
    currencyOwned(value) {
        this.putString(this.offset + 67, value, 3);
        return this;
    }

    // Encode clientID
    clientID(value) {
        this.putString(this.offset + 70, value, 4);
        return this;
    }

    putString(offset, value, length) {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(value);
        for (let i = 0; i < length; i++) {
            this.buffer.setUint8(offset + i, i < bytes.length ? bytes[i] : 0);
        }
    }

}

export default QuoteRequestEncoder;
