import DecimalDecoder from '../DecimalDecoder.js';

class QuoteRequestDecoder {
    static BLOCK_LENGTH = 82;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.offset = 0;
        this.buffer = null;
        this.amountDecoder = new DecimalDecoder();
    }

    wrap(buffer, offset) {
        this.buffer = new DataView(buffer);
        this.offset = offset + 8; // Add the header again? The first field starts at 16
        return this;
    }

    decodeamount() {
        this.amountDecoder.wrap(this.buffer.buffer, this.offset + 0);
        const mantissa = Number(this.amountDecoder.mantissa());
        const exponent = this.amountDecoder.exponent();
        return { mantissa, exponent };
    }

    // Decode saleCurrency
    saleCurrency() {
        return this.getString(this.offset + 9, 3);
    }

    // Decode side
    side() {
        return this.getString(this.offset + 12, 4);
    }

    // Decode symbol
    symbol() {
        return this.getString(this.offset + 16, 6);
    }

    // Decode deliveryDate
    deliveryDate() {
        return this.getString(this.offset + 22, 8);
    }

    // Decode transactTime
    transactTime() {
        return this.getString(this.offset + 30, 21);
    }

    // Decode quoteRequestID
    quoteRequestID() {
        return this.getString(this.offset + 51, 16);
    }

    // Decode currencyOwned
    currencyOwned() {
        return this.getString(this.offset + 67, 3);
    }

    // Decode clientID
    clientID() {
        return this.getString(this.offset + 70, 4);
    }

    toString() {
        return {
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
        const decoder = new TextDecoder();
        const bytes = new Uint8Array(this.buffer.buffer, offset, length);
        return decoder.decode(bytes);
    }

}

export default QuoteRequestDecoder;
