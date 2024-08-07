import DecimalEncoder from '../../../../../frontend/src/messages/DecimalEncoder.js'
import MessageHeaderEncoder from '../../../../../frontend/src/messages/MessageHeaderEncoder.js';

class ExecutionReportEncoder {
    static BLOCK_LENGTH = 146; // Length of the Execution Report message block
    static TEMPLATE_ID = 2;
    static SCHEMA_ID = 1;
    static SCHEMA_VERSION = 1;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.buffer = null;
        this.offset = 0;
        this.amountDecimal = new DecimalEncoder();
        this.secondaryAmountDecimal = new DecimalEncoder();
        this.fxRateDecimal = new DecimalEncoder();
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

    amount(mantissa, exponent) {
        this.amountDecimal.wrap(this.buffer.buffer, this.offset + 8);
        this.amountDecimal.mantissa(mantissa).exponent(exponent);
        return this;
    }

    currency(value) {
        this.putString(this.offset + 17, value, 3);
        return this;
    }

    secondaryAmount(mantissa, exponent) {
        this.secondaryAmountDecimal.wrap(this.buffer.buffer, this.offset + 20);
        this.secondaryAmountDecimal.mantissa(mantissa).exponent(exponent);
        return this;
    }

    secondaryCurrency(value) {
        this.putString(this.offset + 29, value, 3);
        return this;
    }

    side(value) {
        this.putString(this.offset + 32, value, 4);
        return this;
    }

    symbol(value) {
        this.putString(this.offset + 36, value, 6);
        return this;
    }

    deliveryDate(value) {
        this.putString(this.offset + 42, value, 10);
        return this;
    }

    transactTime(value) {
        this.putString(this.offset + 52, value, 21);
        return this;
    }

    quoteRequestID(value) {
        this.putString(this.offset + 73, value, 16);
        return this;
    }

    quoteID(value) {
        this.putString(this.offset + 89, value, 16);
        return this;
    }

    dealRequestID(value) {
        this.putString(this.offset + 105, value, 16);
        return this;
    }

    dealID(value) {
        this.putString(this.offset + 121, value, 16);
        return this;
    }

    fxRate(mantissa, exponent) {
        this.fxRateDecimal.wrap(this.buffer.buffer, this.offset + 137);
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

export default ExecutionReportEncoder;
