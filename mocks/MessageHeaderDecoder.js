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
      return 8; // Mock value
    }
  
    templateId() {
      return 2; // Mock value
    }
  
    schemaId() {
      return 1; // Mock value
    }
  
    version() {
      return 1; // Mock value
    }
  }
  
  module.exports = MessageHeaderDecoder;
  