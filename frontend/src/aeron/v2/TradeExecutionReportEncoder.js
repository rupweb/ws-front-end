import DecimalEncoder from '../DecimalEncoder.js';
import MessageHeaderEncoder from '../MessageHeaderEncoder.js';

class TradeExecutionReportEncoder {
    static BLOCK_LENGTH = 123;
    static LEG_BLOCK_LENGTH = 63;

    static TEMPLATE_ID = 4;
    static SCHEMA_ID = 4;
    static SCHEMA_VERSION = 1;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.buffer = null;
        this.offset = 0;
        this.amountEncoder = new DecimalEncoder();
        this.secondaryAmountEncoder = new DecimalEncoder();
        this.spotEncoder = new DecimalEncoder();
        this.fwdEncoder = new DecimalEncoder();
        this.priceEncoder = new DecimalEncoder();
    }

    wrap(buffer, offset) {
        this.buffer = new DataView(buffer);
        this.offset = offset;
        return this;
    }

    wrapAndApplyHeader(buffer, offset, headerEncoder) {
        headerEncoder.wrap(buffer, offset)
            .blockLength(TradeExecutionReportEncoder.BLOCK_LENGTH)
            .templateId(TradeExecutionReportEncoder.TEMPLATE_ID)
            .schemaId(TradeExecutionReportEncoder.SCHEMA_ID)
            .version(TradeExecutionReportEncoder.SCHEMA_VERSION);
        return this.wrap(buffer, offset + MessageHeaderEncoder.ENCODED_LENGTH);
    }

    // Encode header
    header(value) {
        this.putString(this.offset + 0, value, 8);
        return this;
    }

    // Encode transactionType
    transactionType(value) {
        this.putString(this.offset + 8, value, 3);
        return this;
    }

    // Encode symbol
    symbol(value) {
        this.putString(this.offset + 11, value, 6);
        return this;
    }

    // Encode transactTime
    transactTime(value) {
        this.putString(this.offset + 17, value, 21);
        return this;
    }

    // Encode messageTime
    messageTime(value) {
        this.buffer.setBigInt64(this.offset + 38, value, true);
        return this;
    }

    // Encode quoteRequestID
    quoteRequestID(value) {
        this.putString(this.offset + 46, value, 16);
        return this;
    }

    // Encode quoteID
    quoteID(value) {
        this.putString(this.offset + 62, value, 24);
        return this;
    }

    // Encode dealRequestID
    dealRequestID(value) {
        this.putString(this.offset + 86, value, 16);
        return this;
    }

    // Encode dealID
    dealID(value) {
        this.putString(this.offset + 102, value, 16);
        return this;
    }

    // Encode clientID
    clientID(value) {
        this.putString(this.offset + 118, value, 4);
        return this;
    }

    // Encode processed
    processed(value) {
        this.buffer.setUint8(this.offset + 122, value, true);
        return this;
    }

    encodeLeg(data) {
        const groupHeaderOffset = this.offset + TradeExecutionReportEncoder.BLOCK_LENGTH;
        const numInGroup = data.length;

        this.buffer.setUint16(groupHeaderOffset, this.LEG_BLOCK_LENGTH, TradeExecutionReportEncoder.LITTLE_ENDIAN);
        this.buffer.setUint16(groupHeaderOffset + 2, numInGroup, TradeExecutionReportEncoder.LITTLE_ENDIAN);

        let currentOffset = groupHeaderOffset + 4;
        data.forEach((entry) => {
            this.amountEncoder.wrap(this.buffer.buffer, currentOffset);
            this.amountEncoder.mantissa(entry.amount.mantissa);
            this.amountEncoder.exponent(entry.amount.exponent);
            currentOffset += DecimalEncoder.ENCODED_LENGTH;
            this.putString(currentOffset, entry.currency, 3);
            currentOffset += 3;
            this.secondaryAmountEncoder.wrap(this.buffer.buffer, currentOffset);
            this.secondaryAmountEncoder.mantissa(entry.secondaryAmount.mantissa);
            this.secondaryAmountEncoder.exponent(entry.secondaryAmount.exponent);
            currentOffset += DecimalEncoder.ENCODED_LENGTH;
            this.putString(currentOffset, entry.secondaryCurrency, 3);
            currentOffset += 3;
            this.putString(currentOffset, entry.valueDate, 8);
            currentOffset += 8;
            this.putString(currentOffset, entry.side, 4);
            currentOffset += 4;
            this.spotEncoder.wrap(this.buffer.buffer, currentOffset);
            this.spotEncoder.mantissa(entry.spot.mantissa);
            this.spotEncoder.exponent(entry.spot.exponent);
            currentOffset += DecimalEncoder.ENCODED_LENGTH;
            this.fwdEncoder.wrap(this.buffer.buffer, currentOffset);
            this.fwdEncoder.mantissa(entry.fwd.mantissa);
            this.fwdEncoder.exponent(entry.fwd.exponent);
            currentOffset += DecimalEncoder.ENCODED_LENGTH;
            this.priceEncoder.wrap(this.buffer.buffer, currentOffset);
            this.priceEncoder.mantissa(entry.price.mantissa);
            this.priceEncoder.exponent(entry.price.exponent);
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

export default TradeExecutionReportEncoder;
