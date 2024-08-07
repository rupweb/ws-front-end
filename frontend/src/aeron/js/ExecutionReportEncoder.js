import DecimalEncoder from './DecimalEncoder.js';
import MessageHeaderEncoder from './MessageHeaderEncoder.js';

class ExecutionReportEncoder {
    static BLOCK_LENGTH = 146;
    static TEMPLATE_ID = 2;
    static SCHEMA_ID = 1;
    static SCHEMA_VERSION = 1;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.buffer = null;
        this.offset = 0;
        this.amountEncoder = new DecimalEncoder();
        this.secondaryAmountEncoder = new DecimalEncoder();
        this.fxRateEncoder = new DecimalEncoder();
    }

    wrap(buffer, offset) {
        this.buffer = new DataView(buffer);
        this.offset = offset;
        return this;
    }

    wrapAndApplyHeader(buffer, offset, headerEncoder) {
        headerEncoder.wrap(buffer, offset)
            .blockLength(ExecutionReportEncoder.BLOCK_LENGTH)
            .templateId(ExecutionReportEncoder.TEMPLATE_ID)
            .schemaId(ExecutionReportEncoder.SCHEMA_ID)
            .version(ExecutionReportEncoder.SCHEMA_VERSION);
        return this.wrap(buffer, offset + MessageHeaderEncoder.ENCODED_LENGTH);
    }

    // Encode amount mantissa
    amountMantissa(value) {
        this.buffer.setInt32(this.offset + 0, value, true);
        return this;
    }

    // Encode amount exponent
    amountExponent(value) {
        this.buffer.setInt8(this.offset + 4, value);
        return this;
    }

    // Encode currency
    currency(value) {
        this.putString(this.offset + 9, value, 3);
        return this;
    }

    // Encode secondaryAmount mantissa
    secondaryAmountMantissa(value) {
        this.buffer.setInt32(this.offset + 12, value, true);
        return this;
    }

    // Encode secondaryAmount exponent
    secondaryAmountExponent(value) {
        this.buffer.setInt8(this.offset + 16, value);
        return this;
    }

    // Encode secondaryCurrency
    secondaryCurrency(value) {
        this.putString(this.offset + 21, value, 3);
        return this;
    }

    // Encode side
    side(value) {
        this.putString(this.offset + 24, value, 4);
        return this;
    }

    // Encode symbol
    symbol(value) {
        this.putString(this.offset + 28, value, 6);
        return this;
    }

    // Encode deliveryDate
    deliveryDate(value) {
        this.putString(this.offset + 34, value, 8);
        return this;
    }

    // Encode transactTime
    transactTime(value) {
        this.putString(this.offset + 42, value, 21);
        return this;
    }

    // Encode quoteRequestID
    quoteRequestID(value) {
        this.putString(this.offset + 63, value, 16);
        return this;
    }

    // Encode quoteID
    quoteID(value) {
        this.putString(this.offset + 79, value, 16);
        return this;
    }

    // Encode dealRequestID
    dealRequestID(value) {
        this.putString(this.offset + 95, value, 16);
        return this;
    }

    // Encode dealID
    dealID(value) {
        this.putString(this.offset + 111, value, 16);
        return this;
    }

    // Encode fxRate mantissa
    fxRateMantissa(value) {
        this.buffer.setInt32(this.offset + 127, value, true);
        return this;
    }

    // Encode fxRate exponent
    fxRateExponent(value) {
        this.buffer.setInt8(this.offset + 131, value);
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

export default ExecutionReportEncoder;
