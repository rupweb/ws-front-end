import DecimalEncoder from '../DecimalEncoder.js';
import MessageHeaderEncoder from '../MessageHeaderEncoder.js';

class ConfirmationEncoder {
    static BLOCK_LENGTH = 570;
    static LEG_BLOCK_LENGTH = 430;

    static TEMPLATE_ID = 1;
    static SCHEMA_ID = 1;
    static SCHEMA_VERSION = 1;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.buffer = null;
        this.offset = 0;
        this.amountEncoder = new DecimalEncoder();
        this.secondaryAmountEncoder = new DecimalEncoder();
        this.priceEncoder = new DecimalEncoder();
    }

    wrap(buffer, offset) {
        this.buffer = new DataView(buffer);
        this.offset = offset;
        return this;
    }

    wrapAndApplyHeader(buffer, offset, headerEncoder) {
        headerEncoder.wrap(buffer, offset)
            .blockLength(ConfirmationEncoder.BLOCK_LENGTH)
            .templateId(ConfirmationEncoder.TEMPLATE_ID)
            .schemaId(ConfirmationEncoder.SCHEMA_ID)
            .version(ConfirmationEncoder.SCHEMA_VERSION);
        return this.wrap(buffer, offset + MessageHeaderEncoder.ENCODED_LENGTH);
    }

    // Encode confirmID
    confirmID(value) {
        this.buffer.setUint32(this.offset + 0, value, true);
        return this;
    }

    // Encode client
    client(value) {
        this.putString(this.offset + 4, value, 50);
        return this;
    }

    // Encode clientID
    clientID(value) {
        this.putString(this.offset + 54, value, 20);
        return this;
    }

    // Encode clientEmail
    clientEmail(value) {
        this.putString(this.offset + 74, value, 50);
        return this;
    }

    // Encode dealID
    dealID(value) {
        this.putString(this.offset + 124, value, 20);
        return this;
    }

    // Encode processed
    processed(value) {
        this.buffer.setUint8(this.offset + 144, value, true);
        return this;
    }

    encodeLeg(data) {
        const groupHeaderOffset = ConfirmationEncoder.BLOCK_LENGTH + 8;
        const numInGroup = data.length;

        this.buffer.setUint16(groupHeaderOffset, this.LEG_BLOCK_LENGTH, ConfirmationEncoder.LITTLE_ENDIAN);
        this.buffer.setUint16(groupHeaderOffset + 2, numInGroup, ConfirmationEncoder.LITTLE_ENDIAN);

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

export default ConfirmationEncoder;
