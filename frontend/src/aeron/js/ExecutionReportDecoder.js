import DecimalDecoder from './DecimalDecoder.js';

class ExecutionReportDecoder {
    static LITTLE_ENDIAN = true;

    constructor() {
        this.offset = 0;
        this.buffer = null;
        this.amountDecoder = new DecimalDecoder();
        this.secondaryAmountDecoder = new DecimalDecoder();
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

    // Decode secondaryAmount mantissa
    secondaryAmountMantissa() {
        return this.buffer.getInt32(this.offset + 12, true);
    }

    // Decode secondaryAmount exponent
    secondaryAmountExponent() {
        return this.buffer.getInt8(this.offset + 16);
    }

    // Decode secondaryCurrency
    secondaryCurrency() {
        return this.getString(this.offset + 21, 3);
    }

    // Decode side
    side() {
        return this.getString(this.offset + 24, 4);
    }

    // Decode symbol
    symbol() {
        return this.getString(this.offset + 28, 6);
    }

    // Decode deliveryDate
    deliveryDate() {
        return this.getString(this.offset + 34, 8);
    }

    // Decode transactTime
    transactTime() {
        return this.getString(this.offset + 42, 21);
    }

    // Decode quoteRequestID
    quoteRequestID() {
        return this.getString(this.offset + 63, 16);
    }

    // Decode quoteID
    quoteID() {
        return this.getString(this.offset + 79, 16);
    }

    // Decode dealRequestID
    dealRequestID() {
        return this.getString(this.offset + 95, 16);
    }

    // Decode dealID
    dealID() {
        return this.getString(this.offset + 111, 16);
    }

    // Decode fxRate mantissa
    fxRateMantissa() {
        return this.buffer.getInt32(this.offset + 127, true);
    }

    // Decode fxRate exponent
    fxRateExponent() {
        return this.buffer.getInt8(this.offset + 131);
    }

    toString() {
        return {
            amount: {
                mantissa: this.amountMantissa(),
                exponent: this.amountExponent(),
            },
            currency: this.currency().replace(/\0/g, ''),
            secondaryAmount: {
                mantissa: this.secondaryAmountMantissa(),
                exponent: this.secondaryAmountExponent(),
            },
            secondaryCurrency: this.secondaryCurrency().replace(/\0/g, ''),
            side: this.side().replace(/\0/g, ''),
            symbol: this.symbol().replace(/\0/g, ''),
            deliveryDate: this.deliveryDate().replace(/\0/g, ''),
            transactTime: this.transactTime().replace(/\0/g, ''),
            quoteRequestID: this.quoteRequestID().replace(/\0/g, ''),
            quoteID: this.quoteID().replace(/\0/g, ''),
            dealRequestID: this.dealRequestID().replace(/\0/g, ''),
            dealID: this.dealID().replace(/\0/g, ''),
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

export default ExecutionReportDecoder;
