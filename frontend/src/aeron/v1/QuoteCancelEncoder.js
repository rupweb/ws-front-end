import MessageHeaderEncoder from '../MessageHeaderEncoder.js';

class QuoteCancelEncoder {
    static BLOCK_LENGTH = 55;
    static TEMPLATE_ID = 5;
    static SCHEMA_ID = 1;
    static SCHEMA_VERSION = 1;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.buffer = null;
        this.offset = 0;
    }

    wrap(buffer, offset) {
        this.buffer = new DataView(buffer);
        this.offset = offset;
        return this;
    }

    wrapAndApplyHeader(buffer, offset, headerEncoder) {
        headerEncoder.wrap(buffer, offset)
            .blockLength(QuoteCancelEncoder.BLOCK_LENGTH)
            .templateId(QuoteCancelEncoder.TEMPLATE_ID)
            .schemaId(QuoteCancelEncoder.SCHEMA_ID)
            .version(QuoteCancelEncoder.SCHEMA_VERSION);
        return this.wrap(buffer, offset + MessageHeaderEncoder.ENCODED_LENGTH);
    }

    // Encode header
    header(value) {
        this.putString(this.offset + 0, value, 8);
        return this;
    }

    // Encode symbol
    symbol(value) {
        this.putString(this.offset + 8, value, 6);
        return this;
    }

    // Encode transactTime
    transactTime(value) {
        this.putString(this.offset + 14, value, 21);
        return this;
    }

    // Encode quoteRequestID
    quoteRequestID(value) {
        this.putString(this.offset + 35, value, 16);
        return this;
    }

    // Encode clientID
    clientID(value) {
        this.putString(this.offset + 51, value, 4);
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

export default QuoteCancelEncoder;
