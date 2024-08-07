import handleIncomingMessage from '../../src/handlers/handleIncomingMessage.js';
import QuoteEncoder from '../../src/aeron/js/quoteEncoder.js'
import MessageHeaderEncoder from '../../src/aeron/js/MessageHeaderEncoder.js';

// Mock TextEncoder & TextDecoder
import TextEncoder from '../aeron/TextEncoder.js';
import TextDecoder from '../aeron/TextDecoder.js';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

describe('handleIncomingQuote', () => {
    it('should correctly decode and log a Quote message', () => {
        console.log('handleIncomingQuote test');

        const quote = {
            amount: {
                mantissa: 100000,
                exponent: -2
            },
            currency: 'USD',
            side: 'BUY',
            symbol: 'EURUSD',
            transactTime: '20240101-00:00:00.000',
            quoteID: 'QR123456.1',
            quoteRequestID: 'QR123456',
            fxRate: {
                mantissa: 123450,
                exponent: -5
            },
        };

        console.log(quote);
        console.log("Setup encoder");

        // Setup the quote encoder
        const bufferLength = QuoteEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH;
        const testData = new ArrayBuffer(bufferLength);
        const headerEncoder = new MessageHeaderEncoder();
        const quoteEncoder = new QuoteEncoder();

        console.log("Encode");

        // Encode the quote
        quoteEncoder.wrapAndApplyHeader(testData, 0, headerEncoder);

        quoteEncoder.amountMantissa(quote.amount.mantissa);
        quoteEncoder.amountExponent(quote.amount.exponent);
        quoteEncoder.currency(quote.currency)
        quoteEncoder.side(quote.side)
        quoteEncoder.symbol(quote.symbol)
        quoteEncoder.transactTime(quote.transactTime)
        quoteEncoder.quoteID(quote.quoteID)
        quoteEncoder.quoteRequestID(quote.quoteRequestID)
        quoteEncoder.fxRateMantissa(quote.fxRate.mantissa);
        quoteEncoder.fxRateExponent(quote.fxRate.exponent);

        // Mock console to capture the output
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        // Call test function
        handleIncomingMessage(testData);

        console.log("Check log");

        // Check if the log contains the expected message
        expect(consoleSpy).toHaveBeenCalledWith('Decoded Message:', quote);

        // Restore console
        consoleSpy.mockRestore();
    });
});

