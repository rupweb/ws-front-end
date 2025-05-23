import DecimalDecoder from '../DecimalDecoder.js';

class TradeQuoteRequestDecoder {
    static BLOCK_LENGTH = 66;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.buffer = null;
        this.offset = 0;
        this.amountDecoder = new DecimalDecoder();
        this.leg= [];
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

    decodeLeg() {
        const results = [];
        const groupHeaderOffset = this.offset + TradeQuoteRequestDecoder.BLOCK_LENGTH;
        const numInGroup = this.buffer.getUint16(groupHeaderOffset + 2, TradeQuoteRequestDecoder.LITTLE_ENDIAN);
        let currentOffset = groupHeaderOffset + 4;

        for (let i = 0; i < numInGroup; i++) {
            const entry = {};
            
            this.amountDecoder.wrap(this.buffer.buffer, currentOffset);
            entry.amount = {
                mantissa: this.amountDecoder.mantissa(),
                exponent: this.amountDecoder.exponent()
            };
            currentOffset += DecimalDecoder.ENCODED_LENGTH;

            entry.currency = this.getString(currentOffset, 3);
            currentOffset += 3;
            entry.valueDate = this.getString(currentOffset, 8);
            currentOffset += 8;
            entry.side = this.getString(currentOffset, 4);
            currentOffset += 4;
            results.push(entry);
        }

        return results;
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
                leg: this.decodeLeg(this.buffer, this.offset),
        };
    }

    getString(offset, length) {
        const bytes = new Uint8Array(this.buffer.buffer, this.buffer.byteOffset + offset, length);
        const decoder = new TextDecoder();
        return decoder.decode(bytes);
    }

}

export default TradeQuoteRequestDecoder;
