import DecimalDecoder from './DecimalDecoder.js';

class STPErrorDecoder {
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

    // Decode transactionReferenceNumber
    transactionReferenceNumber() {
        return this.getString(this.offset + 0, 20);
    }

    // Decode message
    message() {
        return this.getString(this.offset + 20, 256);
    }

    toString() {
        return {
            transactionReferenceNumber: this.transactionReferenceNumber().replace(/\0/g, ''),
            message: this.message().replace(/\0/g, ''),
        };
    }

    getString(offset, length) {
        const decoder = new TextDecoder();
        const bytes = new Uint8Array(this.buffer.buffer, offset, length);
        return decoder.decode(bytes);
    }
}

export default STPErrorDecoder;
