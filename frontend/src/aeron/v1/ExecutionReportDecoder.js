import DecimalDecoder from '../DecimalDecoder.js';

class ExecutionReportDecoder {
    static BLOCK_LENGTH = 149;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.buffer = null;
        this.offset = 0;
        this.amountDecoder = new DecimalDecoder();
        this.secondaryAmountDecoder = new DecimalDecoder();
        this.fxRateDecoder = new DecimalDecoder();
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

    // Decode currency
    currency() {
        return this.getString(this.offset + 17, 3);
    }

    decodesecondaryAmount() {
        this.secondaryAmountDecoder.wrap(this.buffer.buffer, this.offset + 20);
        const mantissa = Number(this.secondaryAmountDecoder.mantissa());
        const exponent = this.secondaryAmountDecoder.exponent();
        return { mantissa, exponent };
    }

    // Decode secondaryCurrency
    secondaryCurrency() {
        return this.getString(this.offset + 29, 3);
    }

    // Decode side
    side() {
        return this.getString(this.offset + 32, 4);
    }

    // Decode symbol
    symbol() {
        return this.getString(this.offset + 36, 6);
    }

    // Decode deliveryDate
    deliveryDate() {
        return this.getString(this.offset + 42, 8);
    }

    // Decode transactTime
    transactTime() {
        return this.getString(this.offset + 50, 21);
    }

    // Decode quoteRequestID
    quoteRequestID() {
        return this.getString(this.offset + 71, 16);
    }

    // Decode quoteID
    quoteID() {
        return this.getString(this.offset + 87, 16);
    }

    // Decode dealRequestID
    dealRequestID() {
        return this.getString(this.offset + 103, 16);
    }

    // Decode dealID
    dealID() {
        return this.getString(this.offset + 119, 16);
    }

    // Decode clientID
    clientID() {
        return this.getString(this.offset + 135, 4);
    }

    decodefxRate() {
        this.fxRateDecoder.wrap(this.buffer.buffer, this.offset + 139);
        const mantissa = Number(this.fxRateDecoder.mantissa());
        const exponent = this.fxRateDecoder.exponent();
        return { mantissa, exponent };
    }

    // Decode processed
    processed() {
        return this.buffer.getUint8(this.offset + 148, true);
    }

    toString() {
        return {
                header: this.header().replace(/\0/g, ''),
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
                processed: this.processed(),
        };
    }

    getString(offset, length) {
        const bytes = new Uint8Array(this.buffer.buffer, this.buffer.byteOffset + offset, length);
        const decoder = new TextDecoder();
        return decoder.decode(bytes);
    }

}

export default ExecutionReportDecoder;
