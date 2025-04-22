import DecimalEncoder from '../DecimalEncoder.js';
import MessageHeaderEncoder from '../MessageHeaderEncoder.js';

class PostTradeErrorEncoder {
    static BLOCK_LENGTH = 284;
    static TEMPLATE_ID = 5;
    static SCHEMA_ID = 5;
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
            .blockLength(PostTradeErrorEncoder.BLOCK_LENGTH)
            .templateId(PostTradeErrorEncoder.TEMPLATE_ID)
            .schemaId(PostTradeErrorEncoder.SCHEMA_ID)
            .version(PostTradeErrorEncoder.SCHEMA_VERSION);
        return this.wrap(buffer, offset + MessageHeaderEncoder.ENCODED_LENGTH);
    }

    // Encode header
    header(value) {
        this.putString(this.offset + 0, value, 8);
        return this;
    }

    // Encode transactionReferenceNumber
    transactionReferenceNumber(value) {
        this.putString(this.offset + 8, value, 20);
        return this;
    }

    // Encode message
    message(value) {
        this.putString(this.offset + 28, value, 256);
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

export default PostTradeErrorEncoder;
