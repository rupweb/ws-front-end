import MessageHeaderDecoder from '../messages/MessageHeaderDecoder.js';
import QuoteDecoder from '../messages/QuoteDecoder.js';
import ExecutionReportDecoder from '../messages/ExecutionReportDecoder.js';
import ErrorDecoder from '../messages/ErrorDecoder.js';

const handleIncomingMessage = (data) => {
    console.log('Incoming data: ', data);

    // Check if data is an ArrayBuffer
    if (!(data instanceof ArrayBuffer)) {
        console.error('Data is not an ArrayBuffer:', data);
        return;
    }

    let decodedMessage;

    try {
        const buffer = new DataView(data);
        const headerDecoder = new MessageHeaderDecoder();
        headerDecoder.wrap(buffer, 0);

        switch (headerDecoder.templateId()) {
            case 4: { // Quote
                const quoteDecoder = new QuoteDecoder();
                quoteDecoder.wrapAndApplyHeader(buffer, 0, headerDecoder);
                decodedMessage = quoteDecoder.toString();
                break;
            }
            case 2: { // Execution Report
                const executionReportDecoder = new ExecutionReportDecoder();
                executionReportDecoder.wrapAndApplyHeader(buffer, 0, headerDecoder);
                decodedMessage = executionReportDecoder.toString();
                break;
            }
            case 5: { // Error
                const errorDecoder = new ErrorDecoder();
                errorDecoder.wrapAndApplyHeader(buffer, 0, headerDecoder);
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
