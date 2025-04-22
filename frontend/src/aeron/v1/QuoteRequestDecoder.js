import DecimalDecoder from '../DecimalDecoder.js';

class QuoteRequestDecoder {
    static BLOCK_LENGTH = 82;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.buffer = null;
        this.offset = 0;
        this.amountDecoder = new DecimalDecoder();
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

    decodeamount() {
        this.amountDecoder.wrap(this.buffer.buffer, this.offset + 8);
        const mantissa = Number(this.amountDecoder.mantissa());
        const exponent = this.amountDecoder.exponent();
        return { mantissa, exponent };
    }

    // Decode saleCurrency
    saleCurrency() {
        return this.getString(this.offset + 17, 3);
    }

    // Decode side
    side() {
        return this.getString(this.offset + 20, 4);
    }

    // Decode symbol
    symbol() {
        return this.getString(this.offset + 24, 6);
    }

    // Decode deliveryDate
    deliveryDate() {
        return this.getString(this.offset + 30, 8);
    }

    // Decode transactTime
    transactTime() {
        return this.getString(this.offset + 38, 21);
    }

    // Decode quoteRequestID
    quoteRequestID() {
        return this.getString(this.offset + 59, 16);
    }

    // Decode currencyOwned
    currencyOwned() {
        return this.getString(this.offset + 75, 3);
    }

    // Decode clientID
    clientID() {
        return this.getString(this.offset + 78, 4);
    }

    toString() {
        return {
                header: this.header().replace(/\0/g, ''),
                amount: this.decodeamount(),
                saleCurrency: this.saleCurrency().replace(/\0/g, ''),
                side: this.side().replace(/\0/g, ''),
                symbol: this.symbol().replace(/\0/g, ''),
                deliveryDate: this.deliveryDate().replace(/\0/g, ''),
                transactTime: this.transactTime().replace(/\0/g, ''),
                quoteRequestID: this.quoteRequestID().replace(/\0/g, ''),
                currencyOwned: this.currencyOwned().replace(/\0/g, ''),
                clientID: this.clientID().replace(/\0/g, ''),
        };
    }

    getString(offset, length) {
        const bytes = new Uint8Array(this.buffer.buffer, this.buffer.byteOffset + offset, length);
        const decoder = new TextDecoder();
        return decoder.decode(bytes);
    }

}

export default QuoteRequestDecoder;
