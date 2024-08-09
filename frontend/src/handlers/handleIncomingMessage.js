import MessageHeaderDecoder from '../aeron/js/MessageHeaderDecoder.js';
import QuoteDecoder from '../aeron/js/QuoteDecoder.js';
import ExecutionReportDecoder from '../aeron/js/ExecutionReportDecoder.js';
import ErrorDecoder from '../aeron/js/ErrorDecoder.js';

const handleIncomingMessage = (data, setQuoteData) => {
    console.log('Incoming data: ', data);

    // Check if data is an ArrayBuffer
    if (!(data instanceof ArrayBuffer)) {
        console.error('Data is not an ArrayBuffer:', data);
        return;
    }

    let decodedMessage;

    try {
        const headerDecoder = new MessageHeaderDecoder();

        // Wrap the header to read it
        headerDecoder.wrap(data, 0);

        switch (headerDecoder.templateId()) {
            case 4: { // Quote
                const quoteDecoder = new QuoteDecoder();
                quoteDecoder.wrap(data, MessageHeaderDecoder.ENCODED_LENGTH);
                decodedMessage = quoteDecoder.toString();

                // Decode the fxRate
                const fxRateMantissa = decodedMessage.fxRate.mantissa;
                const fxRateExponent = decodedMessage.fxRate.exponent;
                const conversionRate = fxRateMantissa * Math.pow(10, fxRateExponent);

                // Decode the amount
                const amountMantissa = decodedMessage.amount.mantissa;
                const amountExponent = decodedMessage.amount.exponent;
                const convertedAmount = amountMantissa * Math.pow(10, amountExponent);

                if (!isNaN(conversionRate) && !isNaN(convertedAmount)) {
                    setQuoteData({
                        conversionRate: conversionRate,
                        fromCurrency: decodedMessage.currency,
                        convertedAmount: convertedAmount,
                    });
                } else {
                    console.error('Invalid data received for conversion rate or amount');
                }

                break;
            }
            case 2: { // Execution Report
                const executionReportDecoder = new ExecutionReportDecoder();
                executionReportDecoder.wrap(data, MessageHeaderDecoder.ENCODED_LENGTH);
                decodedMessage = executionReportDecoder.toString();
                break;
            }
            case 5: { // Error
                const errorDecoder = new ErrorDecoder();
                errorDecoder.wrap(data, MessageHeaderDecoder.ENCODED_LENGTH);
                decodedMessage = errorDecoder.toString();
                break;
            }
            default:
                console.error('Unknown message type:', headerDecoder.templateId());
                return;
        }
    } catch (error) {
        console.error('Error processing message:', error);
    }

    console.log('Decoded Message:', decodedMessage);
};

export default handleIncomingMessage;
