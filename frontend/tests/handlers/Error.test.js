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

        const error = {
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

        console.log(error);
        console.log("Setup encoder");

        // Setup the error encoder
        const bufferLength = ErrorEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH;
        const testData = new ArrayBuffer(bufferLength);
        const headerEncoder = new MessageHeaderEncoder();
        const errorEncoder = new ErrorEncoder();

        console.log("Encode");

        // Encode the error
        errorEncoder.wrapAndApplyHeader(testData, 0, headerEncoder);

        errorEncoder.amountMantissa(error.amount.mantissa);
        errorEncoder.amountExponent(error.amount.exponent);
        errorEncoder.currency(error.currency);
        errorEncoder.side(error.side);
        errorEncoder.symbol(error.symbol);
        errorEncoder.deliveryDate(error.deliveryDate);
        errorEncoder.transactTime(error.transactTime);
        errorEncoder.quoteID(error.quoteID);
        errorEncoder.quoteRequestID(error.quoteRequestID);
        errorEncoder.dealRequestID(error.dealRequestID);
        errorEncoder.dealID(error.dealID);
        errorEncoder.fxRateMantissa(error.fxRate.mantissa);
        errorEncoder.fxRateExponent(error.fxRate.exponent);
        errorEncoder.message(error.message);

        // Mock console to capture the output
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        // Call test function
        handleIncomingMessage(testData);

        console.log("Check log");

        // Check if the log contains the expected message
        expect(consoleSpy).toHaveBeenCalledWith('Decoded Message:', error);

        // Restore console
        consoleSpy.mockRestore();
    });
});
