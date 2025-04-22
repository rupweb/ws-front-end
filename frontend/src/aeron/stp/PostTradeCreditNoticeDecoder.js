import DecimalDecoder from '../DecimalDecoder.js';

class PostTradeCreditNoticeDecoder {
    static BLOCK_LENGTH = 409;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.buffer = null;
        this.offset = 0;
        this.amountDecoder = new DecimalDecoder();
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

    // Decode relatedReference
    relatedReference() {
        return this.getString(this.offset + 28, 20);
    }

    // Decode accountIdentification
    accountIdentification() {
        return this.getString(this.offset + 48, 20);
    }

    // Decode valueDate
    valueDate() {
        return this.getString(this.offset + 68, 8);
    }

    // Decode currencyCode
    currencyCode() {
        return this.getString(this.offset + 76, 3);
    }

    decodeamount() {
        this.amountDecoder.wrap(this.buffer.buffer, this.offset + 79);
        const mantissa = Number(this.amountDecoder.mantissa());
        const exponent = this.amountDecoder.exponent();
        return { mantissa, exponent };
    }

    // Decode senderToReceiverInformation
    senderToReceiverInformation() {
        return this.getString(this.offset + 88, 100);
    }

    // Decode orderingCustomer
    orderingCustomer() {
        return this.getString(this.offset + 188, 50);
    }

    // Decode orderingInstitution
    orderingInstitution() {
        return this.getString(this.offset + 238, 50);
    }

    // Decode detailsOfCharges
    detailsOfCharges() {
        return this.getString(this.offset + 288, 20);
    }

    // Decode regulatoryReporting
    regulatoryReporting() {
        return this.getString(this.offset + 308, 100);
    }

    // Decode processed
    processed() {
        return this.buffer.getUint8(this.offset + 408, true);
    }

    toString() {
        return {
                header: this.header().replace(/\0/g, ''),
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
        const bytes = new Uint8Array(this.buffer.buffer, this.buffer.byteOffset + offset, length);
        const decoder = new TextDecoder();
        return decoder.decode(bytes);
    }

}

export default PostTradeCreditNoticeDecoder;
