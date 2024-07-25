import DecimalDecoder from './DecimalDecoder.js';
import MessageHeaderDecoder from './MessageHeaderDecoder.js';

class ExecutionReportDecoder {
    static BLOCK_LENGTH = 290;
    static TEMPLATE_ID = 2;
    static SCHEMA_ID = 1;
    static SCHEMA_VERSION = 1;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.offset = 0;
        this.buffer = null;
        this.amount = new DecimalDecoder();
        this.secondaryAmount = new DecimalDecoder();
        this.fxRate = new DecimalDecoder();
    }

    wrap(buffer, offset) {
        this.buffer = new DataView(buffer);
        this.offset = offset;
        return this;
    }

    wrapAndApplyHeader(buffer, offset, headerDecoder) {
        headerDecoder.wrap(buffer, offset);
        if (headerDecoder.templateId() !== ExecutionReportDecoder.TEMPLATE_ID) {
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

    secondaryAmount() {
        this.secondaryAmount.wrap(this.buffer, this.offset + 20);
        return this.secondaryAmount;
    }

    secondaryCurrency() {
        return this.decodeString(this.offset + 29, 3);
    }

    side() {
        return this.decodeString(this.offset + 32, 4);
    }

    symbol() {
        return this.decodeString(this.offset + 36, 6);
    }

    deliveryDate() {
        return this.decodeString(this.offset + 42, 10);
    }

    transactTime() {
        return this.decodeString(this.offset + 52, 21);
    }

    quoteRequestID() {
        return this.decodeString(this.offset + 73, 36);
    }

    quoteID() {
        return this.decodeString(this.offset + 109, 36);
    }

    dealRequestID() {
        return this.decodeString(this.offset + 145, 36);
    }

    dealID() {
        return this.decodeString(this.offset + 181, 36);
    }

    fxRate() {
        this.fxRate.wrap(this.buffer, this.offset + 217);
        return this.fxRate;
    }

    decodeString(offset, length) {
        const decoder = new TextDecoder();
        return decoder.decode(new Uint8Array(this.buffer.buffer, this.offset + offset, length)).replace(/\0/g, '');
    }

    toString() {
        return `ExecutionReportDecoder(amount=${this.amount()}, currency=${this.currency()}, secondaryAmount=${this.secondaryAmount()}, secondaryCurrency=${this.secondaryCurrency()}, side=${this.side()}, symbol=${this.symbol()}, deliveryDate=${this.deliveryDate()}, transactTime=${this.transactTime()}, quoteRequestID=${this.quoteRequestID()}, quoteID=${this.quoteID()}, dealRequestID=${this.dealRequestID()}, dealID=${this.dealID()}, fxRate=${this.fxRate()})`;
    }
}

export default ExecutionReportDecoder;
