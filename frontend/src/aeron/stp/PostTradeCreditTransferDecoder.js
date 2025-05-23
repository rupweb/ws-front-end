import DecimalDecoder from '../DecimalDecoder.js';

class PostTradeCreditTransferDecoder {
    static BLOCK_LENGTH = 788;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.buffer = null;
        this.offset = 0;
        this.amountDecoder = new DecimalDecoder();
        this.instructedAmountDecoder = new DecimalDecoder();
    }

    wrap(buffer, offset) {
        this.buffer = new DataView(buffer);
        this.offset = offset;
        return this;
    }

    // Decode header
    header() {
        return this.getString(this.offset + 0, 8);
    }

    // Decode transactionReferenceNumber
    transactionReferenceNumber() {
        return this.getString(this.offset + 8, 20);
    }

    // Decode bankOperationCode
    bankOperationCode() {
        return this.getString(this.offset + 28, 20);
    }

    // Decode valueDate
    valueDate() {
        return this.getString(this.offset + 48, 8);
    }

    // Decode currencyCode
    currencyCode() {
        return this.getString(this.offset + 56, 3);
    }

    decodeamount() {
        this.amountDecoder.wrap(this.buffer.buffer, this.offset + 59);
        const mantissa = Number(this.amountDecoder.mantissa());
        const exponent = this.amountDecoder.exponent();
        return { mantissa, exponent };
    }

    decodeinstructedAmount() {
        this.instructedAmountDecoder.wrap(this.buffer.buffer, this.offset + 68);
        const mantissa = Number(this.instructedAmountDecoder.mantissa());
        const exponent = this.instructedAmountDecoder.exponent();
        return { mantissa, exponent };
    }

    // Decode orderingCustomer
    orderingCustomer() {
        return this.getString(this.offset + 77, 50);
    }

    // Decode orderingInstitution
    orderingInstitution() {
        return this.getString(this.offset + 127, 50);
    }

    // Decode sendersCorrespondent
    sendersCorrespondent() {
        return this.getString(this.offset + 177, 50);
    }

    // Decode receiversCorrespondent
    receiversCorrespondent() {
        return this.getString(this.offset + 227, 50);
    }

    // Decode intermediaryInstitution
    intermediaryInstitution() {
        return this.getString(this.offset + 277, 50);
    }

    // Decode accountWithInstitution
    accountWithInstitution() {
        return this.getString(this.offset + 327, 50);
    }

    // Decode beneficiaryCustomer
    beneficiaryCustomer() {
        return this.getString(this.offset + 377, 50);
    }

    // Decode remittanceInformation
    remittanceInformation() {
        return this.getString(this.offset + 427, 100);
    }

    // Decode detailsOfCharges
    detailsOfCharges() {
        return this.getString(this.offset + 527, 20);
    }

    // Decode sendersCharges
    sendersCharges() {
        return this.getString(this.offset + 547, 20);
    }

    // Decode receiversCharges
    receiversCharges() {
        return this.getString(this.offset + 567, 20);
    }

    // Decode senderToReceiverInformation
    senderToReceiverInformation() {
        return this.getString(this.offset + 587, 100);
    }

    // Decode regulatoryReporting
    regulatoryReporting() {
        return this.getString(this.offset + 687, 100);
    }

    // Decode processed
    processed() {
        return this.buffer.getUint8(this.offset + 787, true);
    }

    toString() {
        return {
                header: this.header().replace(/\0/g, ''),
                transactionReferenceNumber: this.transactionReferenceNumber().replace(/\0/g, ''),
                bankOperationCode: this.bankOperationCode().replace(/\0/g, ''),
                valueDate: this.valueDate().replace(/\0/g, ''),
                currencyCode: this.currencyCode().replace(/\0/g, ''),
                amount: this.decodeamount(),
                instructedAmount: this.decodeinstructedAmount(),
                orderingCustomer: this.orderingCustomer().replace(/\0/g, ''),
                orderingInstitution: this.orderingInstitution().replace(/\0/g, ''),
                sendersCorrespondent: this.sendersCorrespondent().replace(/\0/g, ''),
                receiversCorrespondent: this.receiversCorrespondent().replace(/\0/g, ''),
                intermediaryInstitution: this.intermediaryInstitution().replace(/\0/g, ''),
                accountWithInstitution: this.accountWithInstitution().replace(/\0/g, ''),
                beneficiaryCustomer: this.beneficiaryCustomer().replace(/\0/g, ''),
                remittanceInformation: this.remittanceInformation().replace(/\0/g, ''),
                detailsOfCharges: this.detailsOfCharges().replace(/\0/g, ''),
                sendersCharges: this.sendersCharges().replace(/\0/g, ''),
                receiversCharges: this.receiversCharges().replace(/\0/g, ''),
                senderToReceiverInformation: this.senderToReceiverInformation().replace(/\0/g, ''),
                regulatoryReporting: this.regulatoryReporting().replace(/\0/g, ''),
                processed: this.processed(),
        };
    }

    getString(offset, length) {
        const bytes = new Uint8Array(this.buffer.buffer, this.buffer.byteOffset + offset, length);
        const decoder = new TextDecoder();
        return decoder.decode(bytes);
    }

}

export default PostTradeCreditTransferDecoder;
