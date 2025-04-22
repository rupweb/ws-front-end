import DecimalEncoder from '../DecimalEncoder.js';
import MessageHeaderEncoder from '../MessageHeaderEncoder.js';

class PostTradeCreditTransferEncoder {
    static BLOCK_LENGTH = 788;
    static TEMPLATE_ID = 4;
    static SCHEMA_ID = 5;
    static SCHEMA_VERSION = 1;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.buffer = null;
        this.offset = 0;
        this.amountEncoder = new DecimalEncoder();
        this.instructedAmountEncoder = new DecimalEncoder();
    }

    wrap(buffer, offset) {
        this.buffer = new DataView(buffer);
        this.offset = offset;
        return this;
    }

    wrapAndApplyHeader(buffer, offset, headerEncoder) {
        headerEncoder.wrap(buffer, offset)
            .blockLength(PostTradeCreditTransferEncoder.BLOCK_LENGTH)
            .templateId(PostTradeCreditTransferEncoder.TEMPLATE_ID)
            .schemaId(PostTradeCreditTransferEncoder.SCHEMA_ID)
            .version(PostTradeCreditTransferEncoder.SCHEMA_VERSION);
        return this.wrap(buffer, offset + MessageHeaderEncoder.ENCODED_LENGTH);
    }

    // Encode header
    header(value) {
        this.putString(this.offset + 0, value, 8);
        return this;
    }

    // Encode transactionReferenceNumber
    transactionReferenceNumber(value) {
        this.putString(this.offset + 8, value, 20);
        return this;
    }

    // Encode bankOperationCode
    bankOperationCode(value) {
        this.putString(this.offset + 28, value, 20);
        return this;
    }

    // Encode valueDate
    valueDate(value) {
        this.putString(this.offset + 48, value, 8);
        return this;
    }

    // Encode currencyCode
    currencyCode(value) {
        this.putString(this.offset + 56, value, 3);
        return this;
    }

    encodeamount(value) {
        this.amountEncoder.wrap(this.buffer.buffer, this.offset + 59);
        this.amountEncoder.mantissa(value.mantissa);
        this.amountEncoder.exponent(value.exponent);
    }

    encodeinstructedAmount(value) {
        this.instructedAmountEncoder.wrap(this.buffer.buffer, this.offset + 68);
        this.instructedAmountEncoder.mantissa(value.mantissa);
        this.instructedAmountEncoder.exponent(value.exponent);
    }

    // Encode orderingCustomer
    orderingCustomer(value) {
        this.putString(this.offset + 77, value, 50);
        return this;
    }

    // Encode orderingInstitution
    orderingInstitution(value) {
        this.putString(this.offset + 127, value, 50);
        return this;
    }

    // Encode sendersCorrespondent
    sendersCorrespondent(value) {
        this.putString(this.offset + 177, value, 50);
        return this;
    }

    // Encode receiversCorrespondent
    receiversCorrespondent(value) {
        this.putString(this.offset + 227, value, 50);
        return this;
    }

    // Encode intermediaryInstitution
    intermediaryInstitution(value) {
        this.putString(this.offset + 277, value, 50);
        return this;
    }

    // Encode accountWithInstitution
    accountWithInstitution(value) {
        this.putString(this.offset + 327, value, 50);
        return this;
    }

    // Encode beneficiaryCustomer
    beneficiaryCustomer(value) {
        this.putString(this.offset + 377, value, 50);
        return this;
    }

    // Encode remittanceInformation
    remittanceInformation(value) {
        this.putString(this.offset + 427, value, 100);
        return this;
    }

    // Encode detailsOfCharges
    detailsOfCharges(value) {
        this.putString(this.offset + 527, value, 20);
        return this;
    }

    // Encode sendersCharges
    sendersCharges(value) {
        this.putString(this.offset + 547, value, 20);
        return this;
    }

    // Encode receiversCharges
    receiversCharges(value) {
        this.putString(this.offset + 567, value, 20);
        return this;
    }

    // Encode senderToReceiverInformation
    senderToReceiverInformation(value) {
        this.putString(this.offset + 587, value, 100);
        return this;
    }

    // Encode regulatoryReporting
    regulatoryReporting(value) {
        this.putString(this.offset + 687, value, 100);
        return this;
    }

    // Encode processed
    processed(value) {
        this.buffer.setUint8(this.offset + 787, value, true);
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

export default PostTradeCreditTransferEncoder;
