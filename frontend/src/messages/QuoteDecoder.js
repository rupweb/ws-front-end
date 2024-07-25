import DecimalDecoder from './DecimalDecoder.js';
import MessageHeaderDecoder from './MessageHeaderDecoder.js';

class QuoteDecoder {
    static BLOCK_LENGTH = 194;
    static TEMPLATE_ID = 4;
    static SCHEMA_ID = 1;
    static SCHEMA_VERSION = 1;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.offset = 0;
        this.buffer = null;
        this.amount = new DecimalDecoder();
        this.fxRate = new DecimalDecoder();
    }

    wrap(buffer, offset) {
        this.buffer = new DataView(buffer);
        this.offset = offset;
        return this;
    }

    wrapAndApplyHeader(buffer, offset, headerDecoder) {
        headerDecoder.wrap(buffer, offset);
        if (headerDecoder.templateId() !== QuoteDecoder.TEMPLATE_ID) {
            throw new Error(`Invalid TEMPLATE_ID: ${headerDecoder.templateId()}`);
        }
        return this.wrap(buffer, offset + MessageHeaderDecoder.ENCODED_LENGTH);
    }

    amount() {
        this.amount.wrap(this.buffer, this.offset + 8);
        return this.amount;
    }

    currency() {
        return this.decodeString(this.offset + 17, 3);
    }

    side() {
        return this.decodeString(this.offset + 20, 4);
    }

    symbol() {
        return this.decodeString(this.offset + 24, 6);
    }

    transactTime() {
        return this.decodeString(this.offset + 30, 21);
    }

    quoteID() {
        return this.decodeString(this.offset + 51, 36);
    }

    quoteRequestID() {
        return this.decodeString(this.offset + 87, 36);
    }

    fxRate() {
        this.fxRate.wrap(this.buffer, this.offset + 123);
        return this.fxRate;
    }

    decodeString(offset, length) {
        const decoder = new TextDecoder();
        return decoder.decode(new Uint8Array(this.buffer.buffer, this.offset + offset, length)).replace(/\0/g, '');
    }

    toString() {
        return `QuoteDecoder(amount=${this.amount()}, currency=${this.currency()}, side=${this.side()}, symbol=${this.symbol()}, transactTime=${this.transactTime()}, quoteID=${this.quoteID()}, quoteRequestID=${this.quoteRequestID()}, fxRate=${this.fxRate()})`;
    }
}

export default QuoteDecoder;
