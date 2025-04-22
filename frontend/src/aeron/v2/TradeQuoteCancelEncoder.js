import DecimalEncoder from '../DecimalEncoder.js';
import MessageHeaderEncoder from '../MessageHeaderEncoder.js';

class TradeQuoteCancelEncoder {
    static BLOCK_LENGTH = 66;
    static TEMPLATE_ID = 6;
    static SCHEMA_ID = 4;
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
            .blockLength(TradeQuoteCancelEncoder.BLOCK_LENGTH)
            .templateId(TradeQuoteCancelEncoder.TEMPLATE_ID)
            .schemaId(TradeQuoteCancelEncoder.SCHEMA_ID)
            .version(TradeQuoteCancelEncoder.SCHEMA_VERSION);
        return this.wrap(buffer, offset + MessageHeaderEncoder.ENCODED_LENGTH);
    }

    // Encode header
    header(value) {
        this.putString(this.offset + 0, value, 8);
        return this;
    }

    // Encode transactionType
    transactionType(value) {
        this.putString(this.offset + 8, value, 3);
        return this;
    }

    // Encode symbol
    symbol(value) {
        this.putString(this.offset + 11, value, 6);
        return this;
    }

    // Encode transactTime
    transactTime(value) {
        this.putString(this.offset + 17, value, 21);
        return this;
    }

    // Encode messageTime
    messageTime(value) {
        this.buffer.setBigInt64(this.offset + 38, value, true);
        return this;
    }

    // Encode quoteRequestID
    quoteRequestID(value) {
        this.putString(this.offset + 46, value, 16);
        return this;
    }

    // Encode clientID
    clientID(value) {
        this.putString(this.offset + 62, value, 4);
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

export default TradeQuoteCancelEncoder;
