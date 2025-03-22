import DecimalEncoder from '../DecimalEncoder.js';
import MessageHeaderEncoder from '../MessageHeaderEncoder.js';

class TradeQuoteEncoder {
    static BLOCK_LENGTH = 90;
    static LEG_BLOCK_LENGTH = 78;

    static TEMPLATE_ID = 2;
    static SCHEMA_ID = 4;
    static SCHEMA_VERSION = 1;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.buffer = null;
        this.offset = 0;
        this.amountEncoder = new DecimalEncoder();
        this.spotBidEncoder = new DecimalEncoder();
        this.spotOfferEncoder = new DecimalEncoder();
        this.fwdBidEncoder = new DecimalEncoder();
        this.fwdOfferEncoder = new DecimalEncoder();
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
            .blockLength(TradeQuoteEncoder.BLOCK_LENGTH)
            .templateId(TradeQuoteEncoder.TEMPLATE_ID)
            .schemaId(TradeQuoteEncoder.SCHEMA_ID)
            .version(TradeQuoteEncoder.SCHEMA_VERSION);
        return this.wrap(buffer, offset + MessageHeaderEncoder.ENCODED_LENGTH);
    }

    // Encode transactionType
    transactionType(value) {
        this.putString(this.offset + 0, value, 3);
        return this;
    }

    // Encode symbol
    symbol(value) {
        this.putString(this.offset + 3, value, 6);
        return this;
    }

    // Encode transactTime
    transactTime(value) {
        this.putString(this.offset + 9, value, 21);
        return this;
    }

    // Encode messageTime
    messageTime(value) {
        this.buffer.setBigInt64(this.offset + 30, value, true);
        return this;
    }

    // Encode quoteID
    quoteID(value) {
        this.putString(this.offset + 38, value, 24);
        return this;
    }

    // Encode quoteRequestID
    quoteRequestID(value) {
        this.putString(this.offset + 62, value, 16);
        return this;
    }

    // Encode clientID
    clientID(value) {
        this.putString(this.offset + 78, value, 4);
        return this;
    }

    encodeLeg(data) {
        const groupHeaderOffset = this.offset + TradeQuoteEncoder.BLOCK_LENGTH;
        const numInGroup = data.length;

        this.buffer.setUint16(groupHeaderOffset, this.LEG_BLOCK_LENGTH, TradeQuoteEncoder.LITTLE_ENDIAN);
        this.buffer.setUint16(groupHeaderOffset + 2, numInGroup, TradeQuoteEncoder.LITTLE_ENDIAN);

        let currentOffset = groupHeaderOffset + 4;
        data.forEach((entry) => {
            this.amountEncoder.wrap(this.buffer.buffer, currentOffset);
            this.amountEncoder.mantissa(entry.amount.mantissa);
            this.amountEncoder.exponent(entry.amount.exponent);
            currentOffset += DecimalEncoder.ENCODED_LENGTH;
            this.putString(currentOffset, entry.currency, 3);
            currentOffset += 3;
            this.putString(currentOffset, entry.valueDate, 8);
            currentOffset += 8;
            this.putString(currentOffset, entry.side, 4);
            currentOffset += 4;
            this.spotBidEncoder.wrap(this.buffer.buffer, currentOffset);
            this.spotBidEncoder.mantissa(entry.spotBid.mantissa);
            this.spotBidEncoder.exponent(entry.spotBid.exponent);
            currentOffset += DecimalEncoder.ENCODED_LENGTH;
            this.spotOfferEncoder.wrap(this.buffer.buffer, currentOffset);
            this.spotOfferEncoder.mantissa(entry.spotOffer.mantissa);
            this.spotOfferEncoder.exponent(entry.spotOffer.exponent);
            currentOffset += DecimalEncoder.ENCODED_LENGTH;
            this.fwdBidEncoder.wrap(this.buffer.buffer, currentOffset);
            this.fwdBidEncoder.mantissa(entry.fwdBid.mantissa);
            this.fwdBidEncoder.exponent(entry.fwdBid.exponent);
            currentOffset += DecimalEncoder.ENCODED_LENGTH;
            this.fwdOfferEncoder.wrap(this.buffer.buffer, currentOffset);
            this.fwdOfferEncoder.mantissa(entry.fwdOffer.mantissa);
            this.fwdOfferEncoder.exponent(entry.fwdOffer.exponent);
            currentOffset += DecimalEncoder.ENCODED_LENGTH;
            this.bidEncoder.wrap(this.buffer.buffer, currentOffset);
            this.bidEncoder.mantissa(entry.bid.mantissa);
            this.bidEncoder.exponent(entry.bid.exponent);
            currentOffset += DecimalEncoder.ENCODED_LENGTH;
            this.offerEncoder.wrap(this.buffer.buffer, currentOffset);
            this.offerEncoder.mantissa(entry.offer.mantissa);
            this.offerEncoder.exponent(entry.offer.exponent);
            currentOffset += DecimalEncoder.ENCODED_LENGTH;
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

export default TradeQuoteEncoder;
