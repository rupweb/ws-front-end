import DecimalDecoder from './DecimalDecoder.js';

class QuoteDecoder {
    static LITTLE_ENDIAN = true;

    constructor() {
        this.offset = 0;
        this.buffer = null;
        this.amountDecoder = new DecimalDecoder();
        this.fxRateDecoder = new DecimalDecoder();
        this.secondaryAmountDecoder = new DecimalDecoder();
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

    // Decode currency
    currency() {
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

    // Decode transactTime
    transactTime() {
        return this.getString(this.offset + 22, 21);
    }

    // Decode quoteID
    quoteID() {
        return this.getString(this.offset + 43, 16);
    }

    // Decode quoteRequestID
    quoteRequestID() {
        return this.getString(this.offset + 59, 16);
    }

    decodefxRate() {
        this.fxRateDecoder.wrap(this.buffer.buffer, this.offset + 75);
        const mantissa = Number(this.fxRateDecoder.mantissa());
        const exponent = this.fxRateDecoder.exponent();
        return { mantissa, exponent };
    }

    decodesecondaryAmount() {
        this.secondaryAmountDecoder.wrap(this.buffer.buffer, this.offset + 84);
        const mantissa = Number(this.secondaryAmountDecoder.mantissa());
        const exponent = this.secondaryAmountDecoder.exponent();
        return { mantissa, exponent };
    }

    // Decode clientID
    clientID() {
        return this.getString(this.offset + 93, 4);
    }

    toString() {
        return {
            amount: this.decodeamount(),
            currency: this.currency().replace(/\0/g, ''),
            side: this.side().replace(/\0/g, ''),
            symbol: this.symbol().replace(/\0/g, ''),
            transactTime: this.transactTime().replace(/\0/g, ''),
            quoteID: this.quoteID().replace(/\0/g, ''),
            quoteRequestID: this.quoteRequestID().replace(/\0/g, ''),
            fxRate: this.decodefxRate(),
            secondaryAmount: this.decodesecondaryAmount(),
            clientID: this.clientID().replace(/\0/g, ''),
        };
    }

    getString(offset, length) {
        const decoder = new TextDecoder();
        const bytes = new Uint8Array(this.buffer.buffer, offset, length);
        return decoder.decode(bytes);
    }

}

export default QuoteDecoder;
