import DecimalDecoder from './DecimalDecoder.js';
import MessageHeaderDecoder from './MessageHeaderDecoder.js';

class ErrorDecoder {
    static BLOCK_LENGTH = 470;
    static TEMPLATE_ID = 5;
    static SCHEMA_ID = 1;
    static SCHEMA_VERSION = 1;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.offset = 0;
        this.buffer = null;
        this.amount = new DecimalDecoder();
    }

    wrap(buffer, offset) {
        this.buffer = new DataView(buffer);
        this.offset = offset;
        return this;
    }

    wrapAndApplyHeader(buffer, offset, headerDecoder) {
        headerDecoder.wrap(buffer, offset);
        if (headerDecoder.templateId() !== ErrorDecoder.TEMPLATE_ID) {
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

    deliveryDate() {
        return this.decodeString(this.offset + 30, 10);
    }

    transactTime() {
        return this.decodeString(this.offset + 40, 21);
    }

    quoteRequestID() {
        return this.decodeString(this.offset + 61, 36);
    }

    quoteID() {
        return this.decodeString(this.offset + 97, 36);
    }

    dealRequestID() {
        return this.decodeString(this.offset + 133, 36);
    }

    dealID() {
        return this.decodeString(this.offset + 169, 36);
    }

    fxRate() {
        this.fxRate.wrap(this.buffer, this.offset + 205);
        return this.fxRate;
    }

    message() {
        return this.decodeString(this.offset + 214, 256);
    }

    decodeString(offset, length) {
        const decoder = new TextDecoder();
        return decoder.decode(new Uint8Array(this.buffer.buffer, this.offset + offset, length)).replace(/\0/g, '');
    }

    toString() {
        return `ErrorDecoder(amount=${this.amount()}, currency=${this.currency()}, side=${this.side()}, symbol=${this.symbol()}, deliveryDate=${this.deliveryDate()}, transactTime=${this.transactTime()}, quoteRequestID=${this.quoteRequestID()}, quoteID=${this.quoteID()}, dealRequestID=${this.dealRequestID()}, dealID=${this.dealID()}, fxRate=${this.fxRate()}, message=${this.message()})`;
    }
}

export default ErrorDecoder;
