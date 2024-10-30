import DecimalEncoder from './DecimalEncoder.js';
import MessageHeaderEncoder from './MessageHeaderEncoder.js';

class ConfirmationEncoder {
    static BLOCK_LENGTH = 569;
    static TEMPLATE_ID = 1;
    static SCHEMA_ID = 1;
    static SCHEMA_VERSION = 1;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.buffer = null;
        this.offset = 0;
        this.amountEncoder = new DecimalEncoder();
    }

    wrap(buffer, offset) {
        this.buffer = new DataView(buffer);
        this.offset = offset + 8; // Add the header again? The first field starts at 16
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

    // Encode paymentDate
    paymentDate(value) {
        this.putString(this.offset + 144, value, 8);
        return this;
    }

    encodeamount(value) {
        this.amountEncoder.wrap(this.buffer.buffer, this.offset + 152);
        this.amountEncoder.mantissa(value.mantissa);
        this.amountEncoder.exponent(value.exponent);
    }

    // Encode currency
    currency(value) {
        this.putString(this.offset + 161, value, 3);
        return this;
    }

    // Encode country
    country(value) {
        this.putString(this.offset + 164, value, 20);
        return this;
    }

    // Encode beneficiaryIBAN
    beneficiaryIBAN(value) {
        this.putString(this.offset + 184, value, 34);
        return this;
    }

    // Encode beneficiaryBankSWIFT
    beneficiaryBankSWIFT(value) {
        this.putString(this.offset + 218, value, 11);
        return this;
    }

    // Encode bankName
    bankName(value) {
        this.putString(this.offset + 229, value, 50);
        return this;
    }

    // Encode bankAddress
    bankAddress(value) {
        this.putString(this.offset + 279, value, 100);
        return this;
    }

    // Encode branchNo
    branchNo(value) {
        this.putString(this.offset + 379, value, 20);
        return this;
    }

    // Encode beneficiary
    beneficiary(value) {
        this.putString(this.offset + 399, value, 50);
        return this;
    }

    // Encode additionalInformation
    additionalInformation(value) {
        this.putString(this.offset + 449, value, 100);
        return this;
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
