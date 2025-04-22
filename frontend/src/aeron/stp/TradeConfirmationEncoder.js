import DecimalEncoder from '../DecimalEncoder.js';
import MessageHeaderEncoder from '../MessageHeaderEncoder.js';

class TradeConfirmationEncoder {
    static BLOCK_LENGTH = 570;
    static LEG_BLOCK_LENGTH = 448;

    static TEMPLATE_ID = 1;
    static SCHEMA_ID = 5;
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
            .blockLength(TradeConfirmationEncoder.BLOCK_LENGTH)
            .templateId(TradeConfirmationEncoder.TEMPLATE_ID)
            .schemaId(TradeConfirmationEncoder.SCHEMA_ID)
            .version(TradeConfirmationEncoder.SCHEMA_VERSION);
        return this.wrap(buffer, offset + MessageHeaderEncoder.ENCODED_LENGTH);
    }

    // Encode header
    header(value) {
        this.putString(this.offset + 0, value, 8);
        return this;
    }

    // Encode confirmID
    confirmID(value) {
        this.buffer.setUint32(this.offset + 8, value, true);
        return this;
    }

    // Encode client
    client(value) {
        this.putString(this.offset + 12, value, 50);
        return this;
    }

    // Encode clientID
    clientID(value) {
        this.putString(this.offset + 62, value, 20);
        return this;
    }

    // Encode clientEmail
    clientEmail(value) {
        this.putString(this.offset + 82, value, 50);
        return this;
    }

    // Encode dealID
    dealID(value) {
        this.putString(this.offset + 132, value, 20);
        return this;
    }

    // Encode processed
    processed(value) {
        this.buffer.setUint8(this.offset + 152, value, true);
        return this;
    }

    encodeLeg(data) {
        const groupHeaderOffset = this.offset + TradeConfirmationEncoder.BLOCK_LENGTH;
        const numInGroup = data.length;

        this.buffer.setUint16(groupHeaderOffset, this.LEG_BLOCK_LENGTH, TradeConfirmationEncoder.LITTLE_ENDIAN);
        this.buffer.setUint16(groupHeaderOffset + 2, numInGroup, TradeConfirmationEncoder.LITTLE_ENDIAN);

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
            this.putString(currentOffset, entry.paymentDate, 8);
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
            this.putString(currentOffset, entry.country, 20);
            currentOffset += 20;
            this.putString(currentOffset, entry.beneficiaryIBAN, 34);
            currentOffset += 34;
            this.putString(currentOffset, entry.beneficiaryBankSWIFT, 11);
            currentOffset += 11;
            this.putString(currentOffset, entry.bankName, 50);
            currentOffset += 50;
            this.putString(currentOffset, entry.bankAddress, 100);
            currentOffset += 100;
            this.putString(currentOffset, entry.branchNo, 20);
            currentOffset += 20;
            this.putString(currentOffset, entry.beneficiary, 50);
            currentOffset += 50;
            this.putString(currentOffset, entry.additionalInformation, 100);
            currentOffset += 100;
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

export default TradeConfirmationEncoder;
