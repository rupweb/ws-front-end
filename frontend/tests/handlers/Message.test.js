import handleIncomingMessage from '../../src/handlers/handleIncomingMessage.js';
import MessageHeaderEncoder from '../../src/aeron/MessageHeaderEncoder.js';
import AdminEncoder from '../../src/aeron/admin/AdminEncoder.js';
import TextEncoder from '../aeron/TextEncoder.js';
import TextDecoder from '../aeron/TextDecoder.js';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

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
        const testData = new ArrayBuffer(MessageHeaderEncoder.ENCODED_LENGTH + AdminEncoder.BLOCK_LENGTH);
        const headerEncoder = new MessageHeaderEncoder();
        const encoder = new AdminEncoder();
        encoder.wrapAndApplyHeader(testData, 0, headerEncoder);
        encoder
            .header('ADMIN')
            .applicationName('ws-websocket')
            .messageType('INFO')
            .detailedMessage('Connection established')
            .hostInfo('ip-172-31-33-59')
            .timestamp(BigInt(0));

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
