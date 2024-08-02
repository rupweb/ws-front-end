import handleIncomingMessage from '../../src/handleIncomingMessage.js';

describe('handleIncomingMessage', () => {
    it('should decode the message header correctly', () => {
        // Set up test data
        const testData = new ArrayBuffer(8); // Assuming the header is 8 bytes
        const testView = new DataView(testData);
        testView.setUint16(0, 16, true); // blockLength
        testView.setUint16(2, 4, true);  // templateId
        testView.setUint16(4, 1, true);  // schemaId
        testView.setUint16(6, 1, true);  // version

        // Mock console to capture the output
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        // Call test function
        handleIncomingMessage(testData);

        // Check if the output is as expected
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Decoded Message:'));

        // Restore console
        consoleSpy.mockRestore();
    });
});