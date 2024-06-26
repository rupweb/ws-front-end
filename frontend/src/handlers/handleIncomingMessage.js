import { MessageHeaderDecoder } from '../messages/MessageHeaderDecoder';
import { UnsafeBuffer } from 'org.agrona.concurrent.UnsafeBuffer';
import { decodeQuote } from '../messages/decodeQuote';
import { decodeExecutionReport } from '../messages/decodeExecutionReport';

const handleIncomingMessage = (data) => {
    // Decode the header to determine the message type
    const headerDecoder = new MessageHeaderDecoder();
    const buffer = new UnsafeBuffer(data);
    headerDecoder.wrap(buffer, 0);

    const templateId = headerDecoder.templateId();

    let decodedMessage;
    switch (templateId) {
        case 2: // ExecutionReport
        decodedMessage = decodeExecutionReport(data);
        console.log('Decoded ExecutionReport message:', decodedMessage);
        break;
        case 4: // Quote
            decodedMessage = decodeQuote(data);
            console.log('Decoded Quote message:', decodedMessage);
            break;
        // Add cases for other message types
        default:
            console.error('Unknown message type:', templateId);
    }

    // Handle the decoded message...
};

export default handleIncomingMessage;
