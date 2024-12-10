import DecimalEncoder from './DecimalEncoder.js';
import MessageHeaderEncoder from './MessageHeaderEncoder.js';

class ExecutionReportEncoder {
    static BLOCK_LENGTH = 149;
    static TEMPLATE_ID = 2;
    static SCHEMA_ID = 2;
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
        this.offset = offset + 8; // Add the header again? The first field starts at 16
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

    encodeamount(value) {
        this.amountEncoder.wrap(this.buffer.buffer, this.offset + 0);
        this.amountEncoder.mantissa(value.mantissa);
        this.amountEncoder.exponent(value.exponent);
    }

    // Encode currency
    currency(value) {
        this.putString(this.offset + 9, value, 3);
        return this;
    }

    encodesecondaryAmount(value) {
        this.secondaryAmountEncoder.wrap(this.buffer.buffer, this.offset + 12);
        this.secondaryAmountEncoder.mantissa(value.mantissa);
        this.secondaryAmountEncoder.exponent(value.exponent);
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

    // Encode clientID
    clientID(value) {
        this.putString(this.offset + 127, value, 4);
        return this;
    }

    encodefxRate(value) {
        this.fxRateEncoder.wrap(this.buffer.buffer, this.offset + 131);
        this.fxRateEncoder.mantissa(value.mantissa);
        this.fxRateEncoder.exponent(value.exponent);
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
