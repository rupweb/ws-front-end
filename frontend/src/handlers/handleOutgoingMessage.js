const SEND_RETRY_INTERVAL_MS = 50;
const SEND_RETRY_TIMEOUT_MS = 60_000;

const handleOutgoingMessage = (socketRef) => {
    const sendMessage = (data, deadline = Date.now() + SEND_RETRY_TIMEOUT_MS) => {
        const socket = socketRef.current;

        if (socket && socket.readyState === WebSocket.OPEN) {
            console.log('Outgoing data: ', data);
            socket.send(data);
            return;
        }

        if (Date.now() >= deadline) {
            console.error('WebSocket did not open in time. Unable to send message.');
            return;
        }

        if (!socket) {
            console.warn('WebSocket is not ready yet. Retrying send...');
        } else {
            console.warn('WebSocket is still connecting. Retrying send...');
        }

        setTimeout(() => sendMessage(data, deadline), SEND_RETRY_INTERVAL_MS);
    };

    return sendMessage;
};

export default handleOutgoingMessage;

