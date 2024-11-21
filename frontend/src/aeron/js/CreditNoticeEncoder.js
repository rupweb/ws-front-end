import DecimalEncoder from './DecimalEncoder.js';
import MessageHeaderEncoder from './MessageHeaderEncoder.js';

class CreditNoticeEncoder {
    static BLOCK_LENGTH = 409;
    static TEMPLATE_ID = 3;
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
            .blockLength(CreditNoticeEncoder.BLOCK_LENGTH)
            .templateId(CreditNoticeEncoder.TEMPLATE_ID)
            .schemaId(CreditNoticeEncoder.SCHEMA_ID)
            .version(CreditNoticeEncoder.SCHEMA_VERSION);
        return this.wrap(buffer, offset + MessageHeaderEncoder.ENCODED_LENGTH);
    }

    // Encode transactionReferenceNumber
    transactionReferenceNumber(value) {
        this.putString(this.offset + 0, value, 20);
        return this;
    }

    // Encode relatedReference
    relatedReference(value) {
        this.putString(this.offset + 20, value, 20);
        return this;
    }

    // Encode accountIdentification
    accountIdentification(value) {
        this.putString(this.offset + 40, value, 20);
        return this;
    }

    // Encode valueDate
    valueDate(value) {
        this.putString(this.offset + 60, value, 8);
        return this;
    }

    // Encode currencyCode
    currencyCode(value) {
        this.putString(this.offset + 68, value, 3);
        return this;
    }

    encodeamount(value) {
        this.amountEncoder.wrap(this.buffer.buffer, this.offset + 71);
        this.amountEncoder.mantissa(value.mantissa);
        this.amountEncoder.exponent(value.exponent);
    }

    // Encode senderToReceiverInformation
    senderToReceiverInformation(value) {
        this.putString(this.offset + 80, value, 100);
        return this;
    }

    // Encode orderingCustomer
    orderingCustomer(value) {
        this.putString(this.offset + 180, value, 50);
        return this;
    }

    // Encode orderingInstitution
    orderingInstitution(value) {
        this.putString(this.offset + 230, value, 50);
        return this;
    }

    // Encode detailsOfCharges
    detailsOfCharges(value) {
        this.putString(this.offset + 280, value, 20);
        return this;
    }

    // Encode regulatoryReporting
    regulatoryReporting(value) {
        this.putString(this.offset + 300, value, 100);
        return this;
    }

    // Encode processed
    processed(value) {
        this.buffer.setUint8(this.offset + 400, value, true);
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

export default CreditNoticeEncoder;
