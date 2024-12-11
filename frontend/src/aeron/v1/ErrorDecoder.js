import DecimalDecoder from '../DecimalDecoder.js';

class ErrorDecoder {
    static BLOCK_LENGTH = 401;
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

    // Decode quoteID
    quoteID() {
        return this.getString(this.offset + 67, 16);
    }

    // Decode dealRequestID
    dealRequestID() {
        return this.getString(this.offset + 83, 16);
    }

    // Decode dealID
    dealID() {
        return this.getString(this.offset + 99, 16);
    }

    decodefxRate() {
        this.fxRateDecoder.wrap(this.buffer.buffer, this.offset + 115);
        const mantissa = Number(this.fxRateDecoder.mantissa());
        const exponent = this.fxRateDecoder.exponent();
        return { mantissa, exponent };
    }

    decodesecondaryAmount() {
        this.secondaryAmountDecoder.wrap(this.buffer.buffer, this.offset + 124);
        const mantissa = Number(this.secondaryAmountDecoder.mantissa());
        const exponent = this.secondaryAmountDecoder.exponent();
        return { mantissa, exponent };
    }

    // Decode clientID
    clientID() {
        return this.getString(this.offset + 133, 4);
    }

    // Decode message
    message() {
        return this.getString(this.offset + 137, 256);
    }

    toString() {
        return {
                amount: this.decodeamount(),
                currency: this.currency().replace(/\0/g, ''),
                side: this.side().replace(/\0/g, ''),
                symbol: this.symbol().replace(/\0/g, ''),
                deliveryDate: this.deliveryDate().replace(/\0/g, ''),
                transactTime: this.transactTime().replace(/\0/g, ''),
                quoteRequestID: this.quoteRequestID().replace(/\0/g, ''),
                quoteID: this.quoteID().replace(/\0/g, ''),
                dealRequestID: this.dealRequestID().replace(/\0/g, ''),
                dealID: this.dealID().replace(/\0/g, ''),
                fxRate: this.decodefxRate(),
                secondaryAmount: this.decodesecondaryAmount(),
                clientID: this.clientID().replace(/\0/g, ''),
                message: this.message().replace(/\0/g, ''),
        };
    }

    getString(offset, length) {
        const decoder = new TextDecoder();
        const bytes = new Uint8Array(this.buffer.buffer, offset, length);
        return decoder.decode(bytes);
    }

}

export default ErrorDecoder;
