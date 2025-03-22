import DecimalDecoder from '../DecimalDecoder.js';

class CreditNoticeDecoder {
    static BLOCK_LENGTH = 409;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.offset = 0;
        this.buffer = null;
        this.amountDecoder = new DecimalDecoder();
    }

    wrap(buffer, offset) {
        this.buffer = new DataView(buffer);
        this.offset = offset;
        return this;
    }

    // Decode transactionReferenceNumber
    transactionReferenceNumber() {
        return this.getString(this.offset + 0, 20);
    }

    // Decode relatedReference
    relatedReference() {
        return this.getString(this.offset + 20, 20);
    }

    // Decode accountIdentification
    accountIdentification() {
        return this.getString(this.offset + 40, 20);
    }

    // Decode valueDate
    valueDate() {
        return this.getString(this.offset + 60, 8);
    }

    // Decode currencyCode
    currencyCode() {
        return this.getString(this.offset + 68, 3);
    }

    decodeamount() {
        this.amountDecoder.wrap(this.buffer.buffer, this.offset + 71);
        const mantissa = Number(this.amountDecoder.mantissa());
        const exponent = this.amountDecoder.exponent();
        return { mantissa, exponent };
    }

    // Decode senderToReceiverInformation
    senderToReceiverInformation() {
        return this.getString(this.offset + 80, 100);
    }

    // Decode orderingCustomer
    orderingCustomer() {
        return this.getString(this.offset + 180, 50);
    }

    // Decode orderingInstitution
    orderingInstitution() {
        return this.getString(this.offset + 230, 50);
    }

    // Decode detailsOfCharges
    detailsOfCharges() {
        return this.getString(this.offset + 280, 20);
    }

    // Decode regulatoryReporting
    regulatoryReporting() {
        return this.getString(this.offset + 300, 100);
    }

    // Decode processed
    processed() {
        return this.buffer.getUint8(this.offset + 400, true);
    }

    toString() {
        return {
                transactionReferenceNumber: this.transactionReferenceNumber().replace(/\0/g, ''),
                relatedReference: this.relatedReference().replace(/\0/g, ''),
                accountIdentification: this.accountIdentification().replace(/\0/g, ''),
                valueDate: this.valueDate().replace(/\0/g, ''),
                currencyCode: this.currencyCode().replace(/\0/g, ''),
                amount: this.decodeamount(),
                senderToReceiverInformation: this.senderToReceiverInformation().replace(/\0/g, ''),
                orderingCustomer: this.orderingCustomer().replace(/\0/g, ''),
                orderingInstitution: this.orderingInstitution().replace(/\0/g, ''),
                detailsOfCharges: this.detailsOfCharges().replace(/\0/g, ''),
                regulatoryReporting: this.regulatoryReporting().replace(/\0/g, ''),
                processed: this.processed(),
        };
    }

    getString(offset, length) {
        const decoder = new TextDecoder();
        const bytes = new Uint8Array(this.buffer.buffer, offset, length);
        return decoder.decode(bytes);
    }

}

export default CreditNoticeDecoder;
