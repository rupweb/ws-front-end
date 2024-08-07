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

        const executionReport = {
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

        console.log(executionReport);
        console.log("Setup encoder");

        // Setup the execution report encoder
        const bufferLength = ExecutionReportEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH;
        const testData = new ArrayBuffer(bufferLength);
        const headerEncoder = new MessageHeaderEncoder();
        const executionReportEncoder = new ExecutionReportEncoder();

        console.log("Encode");

        // Encode the execution report
        executionReportEncoder.wrapAndApplyHeader(testData, 0, headerEncoder);

        executionReportEncoder.amountMantissa(executionReport.amount.mantissa);
        executionReportEncoder.amountExponent(executionReport.amount.exponent);
        executionReportEncoder.currency(executionReport.currency);
        executionReportEncoder.secondaryAmountMantissa(executionReport.secondaryAmount.mantissa);
        executionReportEncoder.secondaryAmountExponent(executionReport.secondaryAmount.exponent);
        executionReportEncoder.secondaryCurrency(executionReport.secondaryCurrency);
        executionReportEncoder.side(executionReport.side);
        executionReportEncoder.symbol(executionReport.symbol);
        executionReportEncoder.deliveryDate(executionReport.deliveryDate);
        executionReportEncoder.transactTime(executionReport.transactTime);
        executionReportEncoder.quoteID(executionReport.quoteID);
        executionReportEncoder.quoteRequestID(executionReport.quoteRequestID);
        executionReportEncoder.dealRequestID(executionReport.dealRequestID);
        executionReportEncoder.dealID(executionReport.dealID);
        executionReportEncoder.fxRateMantissa(executionReport.fxRate.mantissa);
        executionReportEncoder.fxRateExponent(executionReport.fxRate.exponent);

        // Mock console to capture the output
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        // Call test function
        handleIncomingMessage(testData);

        console.log("Check log");

        // Check if the log contains the expected message
        expect(consoleSpy).toHaveBeenCalledWith('Decoded Message:', executionReport);

        // Restore console
        consoleSpy.mockRestore();
    });
});
