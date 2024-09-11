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

    decodesecondaryAmount() {
        this.secondaryAmountDecoder.wrap(this.buffer.buffer, this.offset + 12);
        const mantissa = Number(this.secondaryAmountDecoder.mantissa());
        const exponent = this.secondaryAmountDecoder.exponent();
        return { mantissa, exponent };
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

    // Decode clientID
    clientID() {
        return this.getString(this.offset + 127, 4);
    }

    decodefxRate() {
        this.fxRateDecoder.wrap(this.buffer.buffer, this.offset + 131);
        const mantissa = Number(this.fxRateDecoder.mantissa());
        const exponent = this.fxRateDecoder.exponent();
        return { mantissa, exponent };
    }

    toString() {
        return {
            amount: this.decodeamount(),
            currency: this.currency().replace(/\0/g, ''),
            secondaryAmount: this.decodesecondaryAmount(),
            secondaryCurrency: this.secondaryCurrency().replace(/\0/g, ''),
            side: this.side().replace(/\0/g, ''),
            symbol: this.symbol().replace(/\0/g, ''),
            deliveryDate: this.deliveryDate().replace(/\0/g, ''),
            transactTime: this.transactTime().replace(/\0/g, ''),
            quoteRequestID: this.quoteRequestID().replace(/\0/g, ''),
            quoteID: this.quoteID().replace(/\0/g, ''),
            dealRequestID: this.dealRequestID().replace(/\0/g, ''),
            dealID: this.dealID().replace(/\0/g, ''),
            clientID: this.clientID().replace(/\0/g, ''),
            fxRate: this.decodefxRate(),
        };
    }

    getString(offset, length) {
        const decoder = new TextDecoder();
        const bytes = new Uint8Array(this.buffer.buffer, offset, length);
        return decoder.decode(bytes);
    }
}

export default ExecutionReportDecoder;
