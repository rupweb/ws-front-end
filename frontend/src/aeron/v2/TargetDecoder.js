import DecimalDecoder from './DecimalDecoder.js';

class QuoteDecoder {
    static LITTLE_ENDIAN = true;

    constructor() {
        this.offset = 0;
        this.buffer = null;
        this.amountDecoder = new DecimalDecoder();
        this.bidDecoder = new DecimalDecoder();
        this.offerDecoder = new DecimalDecoder();
        this.legs = []; // Array to hold decoded group entries
    }

    wrap(buffer, offset) {
        this.buffer = new DataView(buffer);
        this.offset = offset + 8; // Add the header again? The first field starts at 16
        return this;
    }

    transactionType() {
        return this.getString(this.offset + 8, 3);
    }

    symbol() {
        return this.getString(this.offset + 11, 6);
    }

    transactTime() {
        return this.getString(this.offset + 17, 21);
    }

    messageTime() {
        return this.buffer.getBigInt64(this.offset + 38, QuoteDecoder.LITTLE_ENDIAN);
    }

    quoteID() {
        return this.getString(this.offset + 46, 16);
    }

    quoteRequestID() {
        return this.getString(this.offset + 62, 16);
    }

    clientID() {
        return this.getString(this.offset + 78, 4);
    }

    decodeLegs() {
        const groupOffset = this.offset + 82;
        const blockLength = this.buffer.getUint16(groupOffset, QuoteDecoder.LITTLE_ENDIAN);
        const numInGroup = this.buffer.getUint16(groupOffset + 2, QuoteDecoder.LITTLE_ENDIAN);

        let currentOffset = groupOffset + 4; // Start after the group size encoding
        this.legs = [];

        for (let i = 0; i < numInGroup; i++) {
            const leg = {
                amount: this.decodeDecimal(currentOffset),
                currency: this.getString(currentOffset + 8, 3),
                valueDate: this.getString(currentOffset + 11, 8),
                side: this.getString(currentOffset + 19, 4),
                bid: this.decodeDecimal(currentOffset + 23),
                offer: this.decodeDecimal(currentOffset + 31),
            };

            this.legs.push(leg);
            currentOffset += blockLength; // Move to the next leg entry
        }
    }

    decodeDecimal(offset) {
        this.amountDecoder.wrap(this.buffer.buffer, offset);
        const mantissa = Number(this.amountDecoder.mantissa());
        const exponent = this.amountDecoder.exponent();
        return { mantissa, exponent };
    }

    toString() {
        return {
            transactionType: this.transactionType().replace(/\0/g, ''),
            symbol: this.symbol().replace(/\0/g, ''),
            transactTime: this.transactTime().replace(/\0/g, ''),
            messageTime: this.messageTime(),
            quoteID: this.quoteID().replace(/\0/g, ''),
            quoteRequestID: this.quoteRequestID().replace(/\0/g, ''),
            clientID: this.clientID().replace(/\0/g, ''),
            legs: this.legs,
        };
    }

    getString(offset, length) {
        const decoder = new TextDecoder();
        const bytes = new Uint8Array(this.buffer.buffer, offset, length);
        return decoder.decode(bytes);
    }
}

export default QuoteDecoder;
