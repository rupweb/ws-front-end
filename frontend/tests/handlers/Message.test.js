import handleIncomingMessage from '../../src/handlers/handleIncomingMessage.js';

describe('handleIncomingMessage', () => {
    it('should log "Unknown message type: 1" for unknown templateId and return an empty array', () => {
        console.log('handleIncomingMessage test');

        // Set up test data
        const testData = new ArrayBuffer(8); // Assuming the header is 8 bytes
        const testView = new DataView(testData);
        testView.setUint16(0, 16, true); // blockLength
        testView.setUint16(2, 1, true);  // templateId (unknown)
        testView.setUint16(4, 1, true);  // schemaId
        testView.setUint16(6, 1, true);  // version

        // Log the buffer content to verify it
        console.log('Test DataView:', Array.from(new Uint8Array(testData)));

        // Mock console to capture the output
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        // Call test function
        handleIncomingMessage(testData);

        // Check if the error log contains the expected message
        expect(consoleErrorSpy).toHaveBeenCalledWith('Unknown message type:', 1);

        // Check if the log contains "Decoded Message" with an empty message
        expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('Decoded Message:'));

        // Restore console
        consoleSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    it('handles admin message schema3/template1 without unknown-type error', () => {
        const messageLength = 8 + 272; // Header + Admin block
        const testData = new ArrayBuffer(messageLength);
        const testView = new DataView(testData);
        testView.setUint16(0, 272, true); // blockLength
        testView.setUint16(2, 1, true);   // templateId
        testView.setUint16(4, 3, true);   // schemaId (admin)
        testView.setUint16(6, 1, true);   // version

        const writeString = (offset, value, length) => {
            const bytes = new Uint8Array(testData, offset, length);
            bytes.fill(0);
            const max = Math.min(value.length, length);
            for (let i = 0; i < max; i += 1) {
                bytes[i] = value.charCodeAt(i);
            }
        };

        const bodyOffset = 8;
        writeString(bodyOffset + 0, 'ADMIN', 8);
        writeString(bodyOffset + 8, 'ws-websocket', 32);
        writeString(bodyOffset + 64, 'INFO', 8);
        writeString(bodyOffset + 80, 'Connection established', 128);
        writeString(bodyOffset + 208, 'ip-172-31-33-59', 64);

        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        handleIncomingMessage(testData);

        expect(consoleErrorSpy).not.toHaveBeenCalledWith('Unknown message type:', 1);
        expect(consoleLogSpy).toHaveBeenCalledWith(
            'Admin message received:',
            expect.objectContaining({
                header: 'ADMIN',
                applicationName: 'ws-websocket',
                messageType: 'INFO',
                detailedMessage: 'Connection established',
                hostInfo: 'ip-172-31-33-59'
            })
        );

        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });
});
