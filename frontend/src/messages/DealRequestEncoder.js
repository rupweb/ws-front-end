import DecimalEncoder from './DecimalEncoder.js';
import MessageHeaderEncoder from './MessageHeaderEncoder.js';

// This file is manually generated from the SBE messages.xml

class DealRequestEncoder {
    static BLOCK_LENGTH = 214;
    static TEMPLATE_ID = 1;
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
            .blockLength(DealRequestEncoder.BLOCK_LENGTH)
            .templateId(DealRequestEncoder.TEMPLATE_ID)
            .schemaId(DealRequestEncoder.SCHEMA_ID)
            .version(DealRequestEncoder.SCHEMA_VERSION);

        return this.wrap(buffer, offset + MessageHeaderEncoder.ENCODED_LENGTH);
    }

    amount() {
        this.amountDecimal.wrap(this.buffer.buffer, this.offset + 8);
        return this.amountDecimal;
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

    deliveryDate(value) {
        this.putString(this.offset + 30, value, 10);
        return this;
    }

    transactTime(value) {
        this.putString(this.offset + 40, value, 21);
        return this;
    }

    quoteRequestID(value) {
        this.putString(this.offset + 61, value, 16);
        return this;
    }

    quoteID(value) {
        this.putString(this.offset + 77, value, 16);
        return this;
    }

    dealRequestID(value) {
        this.putString(this.offset + 93, value, 16);
        return this;
    }

    fxRate() {
        this.fxRateDecimal.wrap(this.buffer.buffer, this.offset + 109);
        return this.fxRateDecimal;
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
