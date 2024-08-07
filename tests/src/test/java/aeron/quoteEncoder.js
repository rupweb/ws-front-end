import DecimalEncoder from '../../../../../frontend/src/messages/DecimalEncoder.js'
import MessageHeaderEncoder from '../../../../../frontend/src/messages/MessageHeaderEncoder.js';
import TextEncoder from './TextEncoder.js';

class QuoteEncoder {
    static BLOCK_LENGTH = 194; // Length of the Quote message block
    static TEMPLATE_ID = 4;
    static SCHEMA_ID = 1;
    static SCHEMA_VERSION = 1;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.buffer = null;
        this.offset = 0;
        this.amountDecimal = new DecimalEncoder();
        this.fxRateDecimal = new DecimalEncoder();
    }

    wrap(buffer, offset) {
        this.buffer = new DataView(buffer);
        this.offset = offset;
        return this;
    }

    wrapAndApplyHeader(buffer, offset, headerEncoder) {
        headerEncoder.wrap(buffer, offset)
            .blockLength(QuoteEncoder.BLOCK_LENGTH)
            .templateId(QuoteEncoder.TEMPLATE_ID)
            .schemaId(QuoteEncoder.SCHEMA_ID)
            .version(QuoteEncoder.SCHEMA_VERSION);

        return this.wrap(buffer, offset + MessageHeaderEncoder.ENCODED_LENGTH);
    }

    amount(mantissa, exponent) {
        this.amountDecimal.wrap(this.buffer.buffer, this.offset + 8);
        this.amountDecimal.mantissa(mantissa).exponent(exponent);
        return this;
    }

    currency(value) {
        this.putString(this.offset + 17, value, 3);
        return this;
    }

    side(value) {
        this.putString(this.offset + 20, value, 4);
        return this;
    }

    symbol(value) {
        this.putString(this.offset + 24, value, 6);
        return this;
    }

    transactTime(value) {
        this.putString(this.offset + 30, value, 21);
        return this;
    }

    quoteID(value) {
        this.putString(this.offset + 51, value, 36);
        return this;
    }

    quoteRequestID(value) {
        this.putString(this.offset + 87, value, 36);
        return this;
    }

    fxRate(mantissa, exponent) {
        this.fxRateDecimal.wrap(this.buffer.buffer, this.offset + 123);
        this.fxRateDecimal.mantissa(mantissa).exponent(exponent);
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

export default QuoteEncoder;
