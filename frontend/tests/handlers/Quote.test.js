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

        const data = {
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
            secondaryAmount: {
                mantissa: 123450,
                exponent: -2
            },
        };

        console.log(data);
        console.log("Setup encoder");

        // Setup the quote encoder
        const bufferLength = QuoteEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH;
        const buffer = new ArrayBuffer(bufferLength);
        const headerEncoder = new MessageHeaderEncoder();
        const encoder = new QuoteEncoder();

        console.log("Encode");

        // Wrap and set header
        headerEncoder.wrap(buffer, 0)
        .blockLength(QuoteEncoder.BLOCK_LENGTH)
        .templateId(4) 
        .schemaId(1)
        .version(1);

        // Encode the quote
        encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);
        encoder.encodeamount(data.amount);
        encoder.currency(data.currency);
        encoder.side(data.side);
        encoder.symbol(data.symbol);
        encoder.transactTime(data.transactTime);
        encoder.quoteID(data.quoteID);
        encoder.quoteRequestID(data.quoteRequestID);
        encoder.encodefxRate(data.fxRate);
        encoder.encodesecondaryAmount(data.secondaryAmount);

        // Mock console to capture the output
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        // Call test function
        handleIncomingMessage(buffer);

        // Check if the log contains the expected message
        expect(consoleSpy).toHaveBeenCalledWith('Decoded Message:', data);

        // Restore console
        consoleSpy.mockRestore();
    });
});

