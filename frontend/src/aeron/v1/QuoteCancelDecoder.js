class QuoteCancelDecoder {
    static BLOCK_LENGTH = 55;
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

    // Decode symbol
    symbol() {
        return this.getString(this.offset + 8, 6);
    }

    // Decode transactTime
    transactTime() {
        return this.getString(this.offset + 14, 21);
    }

    // Decode quoteRequestID
    quoteRequestID() {
        return this.getString(this.offset + 35, 16);
    }

    // Decode clientID
    clientID() {
        return this.getString(this.offset + 51, 4);
    }

    toString() {
        return {
                header: this.header().replace(/\0/g, ''),
                symbol: this.symbol().replace(/\0/g, ''),
                transactTime: this.transactTime().replace(/\0/g, ''),
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

export default QuoteCancelDecoder;
