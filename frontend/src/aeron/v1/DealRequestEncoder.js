import DecimalEncoder from '../DecimalEncoder.js';
import MessageHeaderEncoder from '../MessageHeaderEncoder.js';

class DealRequestEncoder {
    static BLOCK_LENGTH = 129;
    static TEMPLATE_ID = 1;
    static SCHEMA_ID = 1;
    static SCHEMA_VERSION = 1;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.buffer = null;
        this.offset = 0;
        this.amountEncoder = new DecimalEncoder();
        this.fxRateEncoder = new DecimalEncoder();
        this.secondaryAmountEncoder = new DecimalEncoder();
    }

    wrap(buffer, offset) {
        this.buffer = new DataView(buffer);
        this.offset = offset;
        return this;
    }

    wrapAndApplyHeader(buffer, offset, headerEncoder) {
        headerEncoder.wrap(buffer, offset)
            .blockLength(DealRequestEncoder.BLOCK_LENGTH)
            .templateId(DealRequestEncoder.TEMPLATE_ID)
            .schemaId(DealRequestEncoder.SCHEMA_ID)
            .version(DealRequestEncoder.SCHEMA_VERSION);
        return this.wrap(buffer, offset + MessageHeaderEncoder.ENCODED_LENGTH);
    }

    // Encode header
    header(value) {
        this.putString(this.offset + 0, value, 8);
        return this;
    }

    encodeamount(value) {
        this.amountEncoder.wrap(this.buffer.buffer, this.offset + 8);
        this.amountEncoder.mantissa(value.mantissa);
        this.amountEncoder.exponent(value.exponent);
    }

    // Encode currency
    currency(value) {
        this.putString(this.offset + 17, value, 3);
        return this;
    }

    // Encode side
    side(value) {
        this.putString(this.offset + 20, value, 4);
        return this;
    }

    // Encode symbol
    symbol(value) {
        this.putString(this.offset + 24, value, 6);
        return this;
    }

    // Encode deliveryDate
    deliveryDate(value) {
        this.putString(this.offset + 30, value, 8);
        return this;
    }

    // Encode transactTime
    transactTime(value) {
        this.putString(this.offset + 38, value, 21);
        return this;
    }

    // Encode quoteRequestID
    quoteRequestID(value) {
        this.putString(this.offset + 59, value, 16);
        return this;
    }

    // Encode quoteID
    quoteID(value) {
        this.putString(this.offset + 75, value, 16);
        return this;
    }

    // Encode dealRequestID
    dealRequestID(value) {
        this.putString(this.offset + 91, value, 16);
        return this;
    }

    encodefxRate(value) {
        this.fxRateEncoder.wrap(this.buffer.buffer, this.offset + 107);
        this.fxRateEncoder.mantissa(value.mantissa);
        this.fxRateEncoder.exponent(value.exponent);
    }

    encodesecondaryAmount(value) {
        this.secondaryAmountEncoder.wrap(this.buffer.buffer, this.offset + 116);
        this.secondaryAmountEncoder.mantissa(value.mantissa);
        this.secondaryAmountEncoder.exponent(value.exponent);
    }

    // Encode clientID
    clientID(value) {
        this.putString(this.offset + 125, value, 4);
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

export default DealRequestEncoder;
