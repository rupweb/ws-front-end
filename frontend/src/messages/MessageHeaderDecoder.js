/* eslint-disable no-undef */
const Java = Polyglot.import('java');
const ByteOrder = Java.type('java.nio.ByteOrder').LITTLE_ENDIAN;
/* eslint-enable no-undef */

class MessageHeaderDecoder {
    static ENCODED_LENGTH = 8;

    constructor() {
        this.offset = 0;
        this.buffer = null;
    }

    wrap(buffer, offset) {
        this.buffer = buffer;
        this.offset = offset;
        return this;
    }

    blockLength() {
        return this.buffer.getShort(this.offset + 0, ByteOrder) & 0xFFFF;
    }

    templateId() {
        return this.buffer.getShort(this.offset + 2, ByteOrder) & 0xFFFF;
    }

    schemaId() {
        return this.buffer.getShort(this.offset + 4, ByteOrder) & 0xFFFF;
    }

    version() {
        return this.buffer.getShort(this.offset + 6, ByteOrder) & 0xFFFF;
    }
}

// Expose the class to JavaScript
/* eslint-disable no-undef */
Polyglot.export('MessageHeaderDecoder', MessageHeaderDecoder);
/* eslint-enable no-undef */
