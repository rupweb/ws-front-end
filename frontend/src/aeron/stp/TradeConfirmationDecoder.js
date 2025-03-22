import DecimalDecoder from '../DecimalDecoder.js';

class TradeConfirmationDecoder {
    static BLOCK_LENGTH = 570;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.offset = 0;
        this.buffer = null;
        this.amountDecoder = new DecimalDecoder();
        this.secondaryAmountDecoder = new DecimalDecoder();
        this.spotDecoder = new DecimalDecoder();
        this.fwdDecoder = new DecimalDecoder();
        this.priceDecoder = new DecimalDecoder();
        this.leg= [];
    }

    wrap(buffer, offset) {
        this.buffer = new DataView(buffer);
        this.offset = offset;
        return this;
    }

    // Decode confirmID
    confirmID() {
        return this.buffer.getUint32(this.offset + 0, true);
    }

    // Decode client
    client() {
        return this.getString(this.offset + 4, 50);
    }

    // Decode clientID
    clientID() {
        return this.getString(this.offset + 54, 20);
    }

    // Decode clientEmail
    clientEmail() {
        return this.getString(this.offset + 74, 50);
    }

    // Decode dealID
    dealID() {
        return this.getString(this.offset + 124, 20);
    }

    // Decode processed
    processed() {
        return this.buffer.getUint8(this.offset + 144, true);
    }

    decodeLeg() {
        const results = [];
        const groupHeaderOffset = TradeConfirmationDecoder.BLOCK_LENGTH + 8;
        const numInGroup = this.buffer.getUint16(groupHeaderOffset + 2, TradeConfirmationDecoder.LITTLE_ENDIAN);
        let currentOffset = groupHeaderOffset + 4;

        for (let i = 0; i < numInGroup; i++) {
            const entry = {};
            
            this.amountDecoder.wrap(this.buffer.buffer, currentOffset);
            entry.amount = {
                mantissa: this.amountDecoder.mantissa(),
                exponent: this.amountDecoder.exponent()
            };
            currentOffset += DecimalDecoder.ENCODED_LENGTH;

            entry.currency = this.getString(currentOffset, 3);
            currentOffset += 3;
            
            this.secondaryAmountDecoder.wrap(this.buffer.buffer, currentOffset);
            entry.secondaryAmount = {
                mantissa: this.secondaryAmountDecoder.mantissa(),
                exponent: this.secondaryAmountDecoder.exponent()
            };
            currentOffset += DecimalDecoder.ENCODED_LENGTH;

            entry.secondaryCurrency = this.getString(currentOffset, 3);
            currentOffset += 3;
            entry.paymentDate = this.getString(currentOffset, 8);
            currentOffset += 8;
            entry.side = this.getString(currentOffset, 4);
            currentOffset += 4;
            
            this.spotDecoder.wrap(this.buffer.buffer, currentOffset);
            entry.spot = {
                mantissa: this.spotDecoder.mantissa(),
                exponent: this.spotDecoder.exponent()
            };
            currentOffset += DecimalDecoder.ENCODED_LENGTH;

            
            this.fwdDecoder.wrap(this.buffer.buffer, currentOffset);
            entry.fwd = {
                mantissa: this.fwdDecoder.mantissa(),
                exponent: this.fwdDecoder.exponent()
            };
            currentOffset += DecimalDecoder.ENCODED_LENGTH;

            
            this.priceDecoder.wrap(this.buffer.buffer, currentOffset);
            entry.price = {
                mantissa: this.priceDecoder.mantissa(),
                exponent: this.priceDecoder.exponent()
            };
            currentOffset += DecimalDecoder.ENCODED_LENGTH;

            entry.country = this.getString(currentOffset, 20);
            currentOffset += 20;
            entry.beneficiaryIBAN = this.getString(currentOffset, 34);
            currentOffset += 34;
            entry.beneficiaryBankSWIFT = this.getString(currentOffset, 11);
            currentOffset += 11;
            entry.bankName = this.getString(currentOffset, 50);
            currentOffset += 50;
            entry.bankAddress = this.getString(currentOffset, 100);
            currentOffset += 100;
            entry.branchNo = this.getString(currentOffset, 20);
            currentOffset += 20;
            entry.beneficiary = this.getString(currentOffset, 50);
            currentOffset += 50;
            entry.additionalInformation = this.getString(currentOffset, 100);
            currentOffset += 100;
            results.push(entry);
        }

        return results;
    }

    toString() {
        return {
                confirmID: this.confirmID(),
                client: this.client().replace(/\0/g, ''),
                clientID: this.clientID().replace(/\0/g, ''),
                clientEmail: this.clientEmail().replace(/\0/g, ''),
                dealID: this.dealID().replace(/\0/g, ''),
                processed: this.processed(),
                leg: this.decodeLeg(this.buffer, this.offset),
        };
    }

    getString(offset, length) {
        const decoder = new TextDecoder();
        const bytes = new Uint8Array(this.buffer.buffer, offset, length);
        return decoder.decode(bytes);
    }

}

export default TradeConfirmationDecoder;
