import { MessageHeaderDecoder } from '../messages/MessageHeaderDecoder';
import { decodeQuote } from '../messages/decodeQuote';
import { decodeExecutionReport } from '../messages/decodeExecutionReport';

const handleIncomingMessage = (data) => {
    // Create a buffer from the incoming data
    const buffer = Buffer.from(data);

    // Decode the header to determine the message type
    const headerDecoder = new MessageHeaderDecoder();
    headerDecoder.wrap(buffer, 0);

    const templateId = headerDecoder.templateId();

    let decodedMessage;
    switch (templateId) {
        case 2: // ExecutionReport
            decodedMessage = decodeExecutionReport(buffer);
            console.log('Decoded ExecutionReport message:', decodedMessage);
            break;
        case 4: // Quote
            decodedMessage = decodeQuote(buffer);
            console.log('Decoded Quote message:', decodedMessage);
            break;
        // Add cases for other message types
        default:
            console.error('Unknown message type:', templateId);
    }

    // Handle the decoded message...
};

export default handleIncomingMessage;
