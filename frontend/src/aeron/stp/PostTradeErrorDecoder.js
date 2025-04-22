import DecimalDecoder from '../DecimalDecoder.js';

class PostTradeErrorDecoder {
    static BLOCK_LENGTH = 284;
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

    // Decode transactionReferenceNumber
    transactionReferenceNumber() {
        return this.getString(this.offset + 8, 20);
    }

    // Decode message
    message() {
        return this.getString(this.offset + 28, 256);
    }

    toString() {
        return {
                header: this.header().replace(/\0/g, ''),
                transactionReferenceNumber: this.transactionReferenceNumber().replace(/\0/g, ''),
                message: this.message().replace(/\0/g, ''),
        };
    }

    getString(offset, length) {
        const bytes = new Uint8Array(this.buffer.buffer, this.buffer.byteOffset + offset, length);
        const decoder = new TextDecoder();
        return decoder.decode(bytes);
    }

}

export default PostTradeErrorDecoder;
