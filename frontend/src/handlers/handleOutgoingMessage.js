import encodeQuoteRequest from '../messages/encodeQuoteRequest.js';
import encodeDealRequest from '../messages/encodeDealRequest.js';

const handleOutgoingMessage = (socketRef) => {
    const sendMessage = (message) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            let encodedMessage;
            switch (message.type) {
                case 'QuoteRequest':
                    encodedMessage = encodeQuoteRequest(message.data);
                    break;
                case 'DealRequest':
                    encodedMessage = encodeDealRequest(message.data);
                    break;
                default:
                    console.error('Unknown message type:', message.type);
                    return;
            }

            socketRef.current.send(encodedMessage);
        } else {
            console.error('WebSocket is not open. Unable to send message.');
        }
    };

    return sendMessage;
};

export default handleOutgoingMessage;

