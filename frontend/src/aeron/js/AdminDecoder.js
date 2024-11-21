import DecimalDecoder from './DecimalDecoder.js';

class AdminDecoder {
    static LITTLE_ENDIAN = true;

    constructor() {
        this.offset = 0;
        this.buffer = null;
    }

    wrap(buffer, offset) {
        this.buffer = new DataView(buffer);
        this.offset = offset + 8; // Add the header again? The first field starts at 16
        return this;
    }

    // Decode applicationName
    applicationName() {
        return this.getString(this.offset + 0, 32);
    }

    // Decode instanceId
    instanceId() {
        return this.getString(this.offset + 32, 16);
    }

    // Decode environment
    environment() {
        return this.getString(this.offset + 48, 8);
    }

    // Decode messageType
    messageType() {
        return this.getString(this.offset + 56, 8);
    }

    // Decode timestamp
    timestamp() {
        return this.buffer.getInt64(this.offset + 64, true);
    }

    // Decode detailedMessage
    detailedMessage() {
        return this.getString(this.offset + 72, 128);
    }

    // Decode hostInfo
    hostInfo() {
        return this.getString(this.offset + 200, 64);
    }

    toString() {
        return {
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
        const decoder = new TextDecoder();
        const bytes = new Uint8Array(this.buffer.buffer, offset, length);
        return decoder.decode(bytes);
    }
}

export default AdminDecoder;
