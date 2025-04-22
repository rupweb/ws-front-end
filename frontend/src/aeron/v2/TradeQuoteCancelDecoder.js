import DecimalDecoder from '../DecimalDecoder.js';

class TradeQuoteCancelDecoder {
    static BLOCK_LENGTH = 66;
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

    // Decode transactionType
    transactionType() {
        return this.getString(this.offset + 8, 3);
    }

    // Decode symbol
    symbol() {
        return this.getString(this.offset + 11, 6);
    }

    // Decode transactTime
    transactTime() {
        return this.getString(this.offset + 17, 21);
    }

    // Decode messageTime
    messageTime() {
        return this.buffer.getBigInt64(this.offset + 38, true);
    }

    // Decode quoteRequestID
    quoteRequestID() {
        return this.getString(this.offset + 46, 16);
    }

    // Decode clientID
    clientID() {
        return this.getString(this.offset + 62, 4);
    }

    toString() {
        return {
                header: this.header().replace(/\0/g, ''),
                transactionType: this.transactionType().replace(/\0/g, ''),
                symbol: this.symbol().replace(/\0/g, ''),
                transactTime: this.transactTime().replace(/\0/g, ''),
                messageTime: this.messageTime(),
                quoteRequestID: this.quoteRequestID().replace(/\0/g, ''),
                clientID: this.clientID().replace(/\0/g, ''),
        };
    }

    getString(offset, length) {
        const bytes = new Uint8Array(this.buffer.buffer, this.buffer.byteOffset + offset, length);
        const decoder = new TextDecoder();
        return decoder.decode(bytes);
    }

}

export default TradeQuoteCancelDecoder;
