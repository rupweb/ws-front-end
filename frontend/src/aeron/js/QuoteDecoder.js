import DecimalDecoder from './DecimalDecoder.js';

class QuoteDecoder {
    static LITTLE_ENDIAN = true;

    constructor() {
        this.offset = 0;
        this.buffer = null;
        this.amountDecoder = new DecimalDecoder();
        this.fxRateDecoder = new DecimalDecoder();
    }

    wrap(buffer, offset) {
        this.buffer = new DataView(buffer);
        this.offset = offset;
        return this;
    }

    // Decode amount mantissa
    amountMantissa() {
        return this.buffer.getInt32(this.offset + 0, true);
    }

    // Decode amount exponent
    amountExponent() {
        return this.buffer.getInt8(this.offset + 4);
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

    // Decode fxRate mantissa
    fxRateMantissa() {
        return this.buffer.getInt32(this.offset + 75, true);
    }

    // Decode fxRate exponent
    fxRateExponent() {
        return this.buffer.getInt8(this.offset + 79);
    }

    toString() {
        return {
            amount: {
                mantissa: this.amountMantissa(),
                exponent: this.amountExponent(),
            },
            currency: this.currency().replace(/\0/g, ''),
            side: this.side().replace(/\0/g, ''),
            symbol: this.symbol().replace(/\0/g, ''),
            transactTime: this.transactTime().replace(/\0/g, ''),
            quoteID: this.quoteID().replace(/\0/g, ''),
            quoteRequestID: this.quoteRequestID().replace(/\0/g, ''),
            fxRate: {
                mantissa: this.fxRateMantissa(),
                exponent: this.fxRateExponent(),
            },
        };
    }

    getString(offset, length) {
        const decoder = new TextDecoder();
        const bytes = new Uint8Array(this.buffer.buffer, offset, length);
        return decoder.decode(bytes);
    }
}

export default QuoteDecoder;
