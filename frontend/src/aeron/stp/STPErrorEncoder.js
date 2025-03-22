import DecimalEncoder from '../DecimalEncoder.js';
import MessageHeaderEncoder from '../MessageHeaderEncoder.js';

class STPErrorEncoder {
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
            .blockLength(STPErrorEncoder.BLOCK_LENGTH)
            .templateId(STPErrorEncoder.TEMPLATE_ID)
            .schemaId(STPErrorEncoder.SCHEMA_ID)
            .version(STPErrorEncoder.SCHEMA_VERSION);
        return this.wrap(buffer, offset + MessageHeaderEncoder.ENCODED_LENGTH);
    }

    // Encode transactionReferenceNumber
    transactionReferenceNumber(value) {
        this.putString(this.offset + 0, value, 20);
        return this;
    }

    // Encode message
    message(value) {
        this.putString(this.offset + 20, value, 256);
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

export default STPErrorEncoder;
