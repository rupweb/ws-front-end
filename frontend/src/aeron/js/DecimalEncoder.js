class DecimalEncoder {
    static ENCODED_LENGTH = 9;
    static LITTLE_ENDIAN = true;

    constructor() {
        this.buffer = null;
        this.offset = 0;
    }

    wrap(buffer, offset) {
        this.buffer = new DataView(buffer);
        this.offset = offset;
        return this;
    }

    mantissa(value) {
        this.buffer.setFloat64(this.offset, value, DecimalEncoder.LITTLE_ENDIAN);
        return this;
    }

    exponent(value) {
        this.buffer.setInt8(this.offset + 8, value);
        return this;
    }
}

export default DecimalEncoder;
