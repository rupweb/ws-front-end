import DecimalDecoder from './DecimalDecoder.js';

class QuoteRequestDecoder {
    static LITTLE_ENDIAN = true;

    constructor() {
        this.offset = 0;
        this.buffer = null;
        this.amountDecoder = new DecimalDecoder();
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

    // Decode kycStatus
    kycStatus() {
        const value = this.buffer.getUint8(this.offset + 70);
        const valueMap = {
            3: 'OTHER',
            0: 'NOT_STARTED',
            1: 'PENDING',
            2: 'VERIFIED',
        };
        if (!(value in valueMap)) {
            throw new Error('Invalid enum value: ' + value);
        }
        return valueMap[value];
    }

    toString() {
        return {
            amount: {
                mantissa: this.amountMantissa(),
                exponent: this.amountExponent(),
            },
            saleCurrency: this.saleCurrency().replace(/\0/g, ''),
            side: this.side().replace(/\0/g, ''),
            symbol: this.symbol().replace(/\0/g, ''),
            deliveryDate: this.deliveryDate().replace(/\0/g, ''),
            transactTime: this.transactTime().replace(/\0/g, ''),
            quoteRequestID: this.quoteRequestID().replace(/\0/g, ''),
            currencyOwned: this.currencyOwned().replace(/\0/g, ''),
            kycStatus: this.kycStatus().replace(/\0/g, ''),
        };
    }

    getString(offset, length) {
        const decoder = new TextDecoder();
        const bytes = new Uint8Array(this.buffer.buffer, offset, length);
        return decoder.decode(bytes);
    }
}

export default QuoteRequestDecoder;
