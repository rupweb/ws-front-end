import DecimalEncoder from './DecimalEncoder.js';
import MessageHeaderEncoder from './MessageHeaderEncoder.js';

class QuoteEncoder {
    static BLOCK_LENGTH = 82;
    static TEMPLATE_ID = 2;
    static SCHEMA_ID = 1;
    static SCHEMA_VERSION = 1;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.buffer = null;
        this.offset = 0;
        this.amountEncoder = new DecimalEncoder();
        this.bidEncoder = new DecimalEncoder();
        this.offerEncoder = new DecimalEncoder();
    }

    wrap(buffer, offset) {
        this.buffer = new DataView(buffer);
        this.offset = offset + 8; // Add the header again? The first field starts at 16
        return this;
    }

    wrapAndApplyHeader(buffer, offset, headerEncoder) {
        headerEncoder.wrap(buffer, offset)
            .blockLength(QuoteEncoder.BLOCK_LENGTH)
            .templateId(QuoteEncoder.TEMPLATE_ID)
            .schemaId(QuoteEncoder.SCHEMA_ID)
            .version(QuoteEncoder.SCHEMA_VERSION);
        return this.wrap(buffer, offset + MessageHeaderEncoder.ENCODED_LENGTH);
    }

    transactionType(value) {
        this.putString(this.offset + 8, value, 3);
        return this;
    }

    symbol(value) {
        this.putString(this.offset + 11, value, 6);
        return this;
    }

    transactTime(value) {
        this.putString(this.offset + 17, value, 21);
        return this;
    }

    messageTime(value) {
        this.buffer.setBigInt64(this.offset + 38, BigInt(value), QuoteEncoder.LITTLE_ENDIAN);
        return this;
    }

    quoteID(value) {
        this.putString(this.offset + 46, value, 16);
        return this;
    }

    quoteRequestID(value) {
        this.putString(this.offset + 62, value, 16);
        return this;
    }

    clientID(value) {
        this.putString(this.offset + 78, value, 4);
        return this;
    }

    encodeLegs(legs) {
        const groupOffset = this.offset + 82;
        const blockLength = this.buffer.getUint16(groupOffset, QuoteEncoder.LITTLE_ENDIAN);
        const numInGroup = legs.length;

        this.buffer.setUint16(groupOffset, blockLength, QuoteEncoder.LITTLE_ENDIAN);
        this.buffer.setUint16(groupOffset + 2, numInGroup, QuoteEncoder.LITTLE_ENDIAN);

        let currentOffset = groupOffset + 4; // Start after the group size encoding

        legs.forEach((leg) => {
            this.amountEncoder.wrap(currentOffset, leg.amount);
            this.amountEncoder.mantissa(value.mantissa);
            this.amountEncoder.exponent(value.exponent);

            this.putString(currentOffset + 8, leg.currency, 3);
            this.putString(currentOffset + 11, leg.valueDate, 8);
            this.putString(currentOffset + 19, leg.side, 4);

            this.bidEncoder.wrap(currentOffset, leg.bid);
            this.bidEncoder.mantissa(value.mantissa);
            this.bidEncoder.exponent(value.exponent);

            this.offerEncoder.wrap(currentOffset, leg.offer);
            this.offerEncoder.mantissa(value.mantissa);
            this.offerEncoder.exponent(value.exponent);

            currentOffset += blockLength;
        });
    }

    putString(offset, value, length) {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(value);
        for (let i = 0; i < length; i++) {
            this.buffer.setUint8(offset + i, i < bytes.length ? bytes[i] : 0);
        }
    }
}

export default QuoteEncoder;
