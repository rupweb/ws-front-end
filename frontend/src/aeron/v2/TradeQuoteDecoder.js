import DecimalDecoder from '../DecimalDecoder.js';

class TradeQuoteDecoder {
    static BLOCK_LENGTH = 90;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.buffer = null;
        this.offset = 0;
        this.amountDecoder = new DecimalDecoder();
        this.spotBidDecoder = new DecimalDecoder();
        this.spotOfferDecoder = new DecimalDecoder();
        this.fwdBidDecoder = new DecimalDecoder();
        this.fwdOfferDecoder = new DecimalDecoder();
        this.bidDecoder = new DecimalDecoder();
        this.offerDecoder = new DecimalDecoder();
        this.leg= [];
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

    // Decode transactionType
    transactionType() {
        return this.getString(this.offset + 8, 3);
    }

    // Decode symbol
    symbol() {
        return this.getString(this.offset + 11, 6);
    }

    // Decode transactTime
    transactTime() {
        return this.getString(this.offset + 17, 21);
    }

    // Decode messageTime
    messageTime() {
        return this.buffer.getBigInt64(this.offset + 38, true);
    }

    // Decode quoteID
    quoteID() {
        return this.getString(this.offset + 46, 24);
    }

    // Decode quoteRequestID
    quoteRequestID() {
        return this.getString(this.offset + 70, 16);
    }

    // Decode clientID
    clientID() {
        return this.getString(this.offset + 86, 4);
    }

    decodeLeg() {
        const results = [];
        const groupHeaderOffset = this.offset + TradeQuoteDecoder.BLOCK_LENGTH;
        const numInGroup = this.buffer.getUint16(groupHeaderOffset + 2, TradeQuoteDecoder.LITTLE_ENDIAN);
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
            entry.valueDate = this.getString(currentOffset, 8);
            currentOffset += 8;
            entry.side = this.getString(currentOffset, 4);
            currentOffset += 4;
            
            this.spotBidDecoder.wrap(this.buffer.buffer, currentOffset);
            entry.spotBid = {
                mantissa: this.spotBidDecoder.mantissa(),
                exponent: this.spotBidDecoder.exponent()
            };
            currentOffset += DecimalDecoder.ENCODED_LENGTH;

            
            this.spotOfferDecoder.wrap(this.buffer.buffer, currentOffset);
            entry.spotOffer = {
                mantissa: this.spotOfferDecoder.mantissa(),
                exponent: this.spotOfferDecoder.exponent()
            };
            currentOffset += DecimalDecoder.ENCODED_LENGTH;

            
            this.fwdBidDecoder.wrap(this.buffer.buffer, currentOffset);
            entry.fwdBid = {
                mantissa: this.fwdBidDecoder.mantissa(),
                exponent: this.fwdBidDecoder.exponent()
            };
            currentOffset += DecimalDecoder.ENCODED_LENGTH;

            
            this.fwdOfferDecoder.wrap(this.buffer.buffer, currentOffset);
            entry.fwdOffer = {
                mantissa: this.fwdOfferDecoder.mantissa(),
                exponent: this.fwdOfferDecoder.exponent()
            };
            currentOffset += DecimalDecoder.ENCODED_LENGTH;

            
            this.bidDecoder.wrap(this.buffer.buffer, currentOffset);
            entry.bid = {
                mantissa: this.bidDecoder.mantissa(),
                exponent: this.bidDecoder.exponent()
            };
            currentOffset += DecimalDecoder.ENCODED_LENGTH;

            
            this.offerDecoder.wrap(this.buffer.buffer, currentOffset);
            entry.offer = {
                mantissa: this.offerDecoder.mantissa(),
                exponent: this.offerDecoder.exponent()
            };
            currentOffset += DecimalDecoder.ENCODED_LENGTH;

            results.push(entry);
        }

        return results;
    }

    toString() {
        return {
                header: this.header().replace(/\0/g, ''),
                transactionType: this.transactionType().replace(/\0/g, ''),
                symbol: this.symbol().replace(/\0/g, ''),
                transactTime: this.transactTime().replace(/\0/g, ''),
                messageTime: this.messageTime(),
                quoteID: this.quoteID().replace(/\0/g, ''),
                quoteRequestID: this.quoteRequestID().replace(/\0/g, ''),
                clientID: this.clientID().replace(/\0/g, ''),
                leg: this.decodeLeg(this.buffer, this.offset),
        };
    }

    getString(offset, length) {
        const bytes = new Uint8Array(this.buffer.buffer, this.buffer.byteOffset + offset, length);
        const decoder = new TextDecoder();
        return decoder.decode(bytes);
    }

}

export default TradeQuoteDecoder;
