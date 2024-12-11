import DecimalDecoder from '../DecimalDecoder.js';

class ConfirmationDecoder {
    static BLOCK_LENGTH = 570;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.offset = 0;
        this.buffer = null;
        this.amountDecoder = new DecimalDecoder();
    }

    wrap(buffer, offset) {
        this.buffer = new DataView(buffer);
        this.offset = offset + 8; // Add the header again? The first field starts at 16
        return this;
    }

    // Decode client
    client() {
        return this.getString(this.offset + 0, 50);
    }

    // Decode clientID
    clientID() {
        return this.getString(this.offset + 50, 20);
    }

    // Decode clientEmail
    clientEmail() {
        return this.getString(this.offset + 70, 50);
    }

    // Decode dealID
    dealID() {
        return this.getString(this.offset + 120, 20);
    }

    // Decode paymentDate
    paymentDate() {
        return this.getString(this.offset + 140, 8);
    }

    decodeamount() {
        this.amountDecoder.wrap(this.buffer.buffer, this.offset + 148);
        const mantissa = Number(this.amountDecoder.mantissa());
        const exponent = this.amountDecoder.exponent();
        return { mantissa, exponent };
    }

    // Decode currency
    currency() {
        return this.getString(this.offset + 157, 3);
    }

    // Decode country
    country() {
        return this.getString(this.offset + 160, 20);
    }

    // Decode beneficiaryIBAN
    beneficiaryIBAN() {
        return this.getString(this.offset + 180, 34);
    }

    // Decode beneficiaryBankSWIFT
    beneficiaryBankSWIFT() {
        return this.getString(this.offset + 214, 11);
    }

    // Decode bankName
    bankName() {
        return this.getString(this.offset + 225, 50);
    }

    // Decode bankAddress
    bankAddress() {
        return this.getString(this.offset + 275, 100);
    }

    // Decode branchNo
    branchNo() {
        return this.getString(this.offset + 375, 20);
    }

    // Decode beneficiary
    beneficiary() {
        return this.getString(this.offset + 395, 50);
    }

    // Decode additionalInformation
    additionalInformation() {
        return this.getString(this.offset + 445, 100);
    }

    toString() {
        return {
                confirmID: this.confirmID(),
                client: this.client().replace(/\0/g, ''),
                clientID: this.clientID().replace(/\0/g, ''),
                clientEmail: this.clientEmail().replace(/\0/g, ''),
                dealID: this.dealID().replace(/\0/g, ''),
                paymentDate: this.paymentDate().replace(/\0/g, ''),
                amount: this.decodeamount(),
                currency: this.currency().replace(/\0/g, ''),
                country: this.country().replace(/\0/g, ''),
                beneficiaryIBAN: this.beneficiaryIBAN().replace(/\0/g, ''),
                beneficiaryBankSWIFT: this.beneficiaryBankSWIFT().replace(/\0/g, ''),
                bankName: this.bankName().replace(/\0/g, ''),
                bankAddress: this.bankAddress().replace(/\0/g, ''),
                branchNo: this.branchNo().replace(/\0/g, ''),
                beneficiary: this.beneficiary().replace(/\0/g, ''),
                additionalInformation: this.additionalInformation().replace(/\0/g, ''),
                processed: this.processed(),
        };
    }

    getString(offset, length) {
        const decoder = new TextDecoder();
        const bytes = new Uint8Array(this.buffer.buffer, offset, length);
        return decoder.decode(bytes);
    }

}

export default ConfirmationDecoder;
