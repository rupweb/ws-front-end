import DecimalEncoder from '../DecimalEncoder.js';
import MessageHeaderEncoder from '../MessageHeaderEncoder.js';

class AdminEncoder {
    static BLOCK_LENGTH = 272;
    static TEMPLATE_ID = 1;
    static SCHEMA_ID = 3;
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
            .blockLength(AdminEncoder.BLOCK_LENGTH)
            .templateId(AdminEncoder.TEMPLATE_ID)
            .schemaId(AdminEncoder.SCHEMA_ID)
            .version(AdminEncoder.SCHEMA_VERSION);
        return this.wrap(buffer, offset + MessageHeaderEncoder.ENCODED_LENGTH);
    }

    // Encode header
    header(value) {
        this.putString(this.offset + 0, value, 8);
        return this;
    }

    // Encode applicationName
    applicationName(value) {
        this.putString(this.offset + 8, value, 32);
        return this;
    }

    // Encode instanceId
    instanceId(value) {
        this.putString(this.offset + 40, value, 16);
        return this;
    }

    // Encode environment
    environment(value) {
        this.putString(this.offset + 56, value, 8);
        return this;
    }

    // Encode messageType
    messageType(value) {
        this.putString(this.offset + 64, value, 8);
        return this;
    }

    // Encode timestamp
    timestamp(value) {
        this.buffer.setBigInt64(this.offset + 72, value, true);
        return this;
    }

    // Encode detailedMessage
    detailedMessage(value) {
        this.putString(this.offset + 80, value, 128);
        return this;
    }

    // Encode hostInfo
    hostInfo(value) {
        this.putString(this.offset + 208, value, 64);
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

export default AdminEncoder;
