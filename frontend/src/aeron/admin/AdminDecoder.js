import DecimalDecoder from '../DecimalDecoder.js';

class AdminDecoder {
    static BLOCK_LENGTH = 272;
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

    // Decode header
    header() {
        return this.getString(this.offset + 0, 8);
    }

    // Decode applicationName
    applicationName() {
        return this.getString(this.offset + 8, 32);
    }

    // Decode instanceId
    instanceId() {
        return this.getString(this.offset + 40, 16);
    }

    // Decode environment
    environment() {
        return this.getString(this.offset + 56, 8);
    }

    // Decode messageType
    messageType() {
        return this.getString(this.offset + 64, 8);
    }

    // Decode timestamp
    timestamp() {
        return this.buffer.getBigInt64(this.offset + 72, true);
    }

    // Decode detailedMessage
    detailedMessage() {
        return this.getString(this.offset + 80, 128);
    }

    // Decode hostInfo
    hostInfo() {
        return this.getString(this.offset + 208, 64);
    }

    toString() {
        return {
                header: this.header().replace(/\0/g, ''),
                applicationName: this.applicationName().replace(/\0/g, ''),
                instanceId: this.instanceId().replace(/\0/g, ''),
                environment: this.environment().replace(/\0/g, ''),
                messageType: this.messageType().replace(/\0/g, ''),
                timestamp: this.timestamp().replace(/\0/g, ''),
                detailedMessage: this.detailedMessage().replace(/\0/g, ''),
                hostInfo: this.hostInfo().replace(/\0/g, ''),
        };
    }

    getString(offset, length) {
        const bytes = new Uint8Array(this.buffer.buffer, this.buffer.byteOffset + offset, length);
        const decoder = new TextDecoder();
        return decoder.decode(bytes);
    }

}

export default AdminDecoder;
