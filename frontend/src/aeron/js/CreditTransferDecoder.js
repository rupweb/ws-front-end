import DecimalDecoder from './DecimalDecoder.js';

class CreditTransferDecoder {
    static LITTLE_ENDIAN = true;

    constructor() {
        this.offset = 0;
        this.buffer = null;
        this.amountDecoder = new DecimalDecoder();
        this.instructedAmountDecoder = new DecimalDecoder();
    }

    wrap(buffer, offset) {
        this.buffer = new DataView(buffer);
        this.offset = offset + 8; // Add the header again? The first field starts at 16
        return this;
    }

    // Decode transactionReferenceNumber
    transactionReferenceNumber() {
        return this.getString(this.offset + 0, 20);
    }

    // Decode bankOperationCode
    bankOperationCode() {
        return this.getString(this.offset + 20, 20);
    }

    // Decode valueDate
    valueDate() {
        return this.getString(this.offset + 40, 8);
    }

    // Decode currencyCode
    currencyCode() {
        return this.getString(this.offset + 48, 3);
    }

    decodeamount() {
        this.amountDecoder.wrap(this.buffer.buffer, this.offset + 51);
        const mantissa = Number(this.amountDecoder.mantissa());
        const exponent = this.amountDecoder.exponent();
        return { mantissa, exponent };
    }

    decodeinstructedAmount() {
        this.instructedAmountDecoder.wrap(this.buffer.buffer, this.offset + 60);
        const mantissa = Number(this.instructedAmountDecoder.mantissa());
        const exponent = this.instructedAmountDecoder.exponent();
        return { mantissa, exponent };
    }

    // Decode orderingCustomer
    orderingCustomer() {
        return this.getString(this.offset + 69, 50);
    }

    // Decode orderingInstitution
    orderingInstitution() {
        return this.getString(this.offset + 119, 50);
    }

    // Decode sendersCorrespondent
    sendersCorrespondent() {
        return this.getString(this.offset + 169, 50);
    }

    // Decode receiversCorrespondent
    receiversCorrespondent() {
        return this.getString(this.offset + 219, 50);
    }

    // Decode intermediaryInstitution
    intermediaryInstitution() {
        return this.getString(this.offset + 269, 50);
    }

    // Decode accountWithInstitution
    accountWithInstitution() {
        return this.getString(this.offset + 319, 50);
    }

    // Decode beneficiaryCustomer
    beneficiaryCustomer() {
        return this.getString(this.offset + 369, 50);
    }

    // Decode remittanceInformation
    remittanceInformation() {
        return this.getString(this.offset + 419, 100);
    }

    // Decode detailsOfCharges
    detailsOfCharges() {
        return this.getString(this.offset + 519, 20);
    }

    // Decode sendersCharges
    sendersCharges() {
        return this.getString(this.offset + 539, 20);
    }

    // Decode receiversCharges
    receiversCharges() {
        return this.getString(this.offset + 559, 20);
    }

    // Decode senderToReceiverInformation
    senderToReceiverInformation() {
        return this.getString(this.offset + 579, 100);
    }

    // Decode regulatoryReporting
    regulatoryReporting() {
        return this.getString(this.offset + 679, 100);
    }

    toString() {
        return {
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
        };
    }

    getString(offset, length) {
        const decoder = new TextDecoder();
        const bytes = new Uint8Array(this.buffer.buffer, offset, length);
        return decoder.decode(bytes);
    }
}

export default CreditTransferDecoder;
