import handleIncomingMessage from '../../src/handlers/handleIncomingMessage.js';
import ErrorEncoder from '../../src/aeron/js/errorEncoder.js';
import MessageHeaderEncoder from '../../src/aeron/js/MessageHeaderEncoder.js';

// Mock TextEncoder & TextDecoder
import TextEncoder from '../aeron/TextEncoder.js';
import TextDecoder from '../aeron/TextDecoder.js';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

describe('handleIncomingError', () => {
    it('should correctly decode and log an Error message', () => {
        console.log('handleIncomingError test');

        const data = {
            amount: {
                mantissa: 500000,
                exponent: -2
            },
            currency: 'GBP',
            side: 'BUY',
            symbol: 'GBPUSD',
            deliveryDate: '20240807',
            transactTime: '20240101-00:00:00.000',
            quoteID: 'ER654321.1',
            quoteRequestID: 'QR654321',
            dealRequestID: 'DR654321',
            dealID: 'D654321',
            fxRate: {
                mantissa: 134560,
                exponent: -5
            },
            message: 'Error processing the request due to invalid input parameters.'
        };

        console.log(data);
        console.log("Setup encoder");

        // Setup the error encoder
        const bufferLength = ErrorEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH;
        const buffer = new ArrayBuffer(bufferLength);
        const headerEncoder = new MessageHeaderEncoder();
        const encoder = new ErrorEncoder();

        console.log("Encode");

        // Wrap and set header
        headerEncoder.wrap(buffer, 0)
        .blockLength(ErrorEncoder.BLOCK_LENGTH)
        .templateId(5) 
        .schemaId(1)
        .version(1);

        // Encode the data
        encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);
        encoder.encodeamount(data.amount);
        encoder.currency(data.currency);
        encoder.side(data.side);
        encoder.symbol(data.symbol);
        encoder.deliveryDate(data.deliveryDate);
        encoder.transactTime(data.transactTime);
        encoder.quoteRequestID(data.quoteRequestID);
        encoder.quoteID(data.quoteID);
        encoder.dealRequestID(data.dealRequestID);
        encoder.dealID(data.dealID);
        encoder.encodefxRate(data.fxRate);
        encoder.message(data.message);

        // Mock console to capture the output
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        // Call test function
        console.log("Test");
        handleIncomingMessage(buffer);

        console.log("Check log");

        // Check if the log contains the expected message
        expect(consoleSpy).toHaveBeenCalledWith('Decoded Message:', data);

        // Restore console
        consoleSpy.mockRestore();
    });
});
