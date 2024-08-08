import handleIncomingMessage from '../../src/handlers/handleIncomingMessage.js';
import ExecutionReportEncoder from '../../src/aeron/js/executionReportEncoder.js';
import MessageHeaderEncoder from '../../src/aeron/js/MessageHeaderEncoder.js';

// Mock TextEncoder & TextDecoder
import TextEncoder from '../aeron/TextEncoder.js';
import TextDecoder from '../aeron/TextDecoder.js';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

describe('handleIncomingExecutionReport', () => {
    it('should correctly decode and log an ExecutionReport message', () => {
        console.log('handleIncomingExecutionReport test');

        const data = {
            amount: {
                mantissa: 100000,
                exponent: -2
            },
            currency: 'USD',
            secondaryAmount: {
                mantissa: 200000,
                exponent: -2
            },
            secondaryCurrency: 'EUR',
            side: 'SELL',
            symbol: 'EURUSD',
            deliveryDate: '20240807',
            transactTime: '20240101-00:00:00.000',
            quoteID: 'ER123456.1',
            quoteRequestID: 'QR123456',
            dealRequestID: 'DR123456',
            dealID: 'D123456',
            fxRate: {
                mantissa: 123450,
                exponent: -5
            },
        };

        console.log(data);
        console.log("Setup encoder");

        // Setup the execution report encoder
        const bufferLength = ExecutionReportEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH;
        const buffer = new ArrayBuffer(bufferLength);
        const headerEncoder = new MessageHeaderEncoder();
        const encoder = new ExecutionReportEncoder();

        console.log("Encode");

        // Wrap and set header
        headerEncoder.wrap(buffer, 0)
        .blockLength(ExecutionReportEncoder.BLOCK_LENGTH)
        .templateId(2) 
        .schemaId(1)
        .version(1);

        // Encode the data
        encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);
        encoder.encodeamount(data.amount);
        encoder.currency(data.currency);
        encoder.encodesecondaryAmount(data.secondaryAmount);
        encoder.secondaryCurrency(data.secondaryCurrency);
        encoder.side(data.side);
        encoder.symbol(data.symbol);
        encoder.deliveryDate(data.deliveryDate);
        encoder.transactTime(data.transactTime);
        encoder.quoteRequestID(data.quoteRequestID);
        encoder.quoteID(data.quoteID);
        encoder.dealRequestID(data.dealRequestID);
        encoder.dealID(data.dealID);
        encoder.encodefxRate(data.fxRate);

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
