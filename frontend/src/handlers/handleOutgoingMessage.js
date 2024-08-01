const handleOutgoingMessage = (socketRef) => {
    const sendMessage = (encodedMessage) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(encodedMessage);
        } else {
            console.error('WebSocket is not open. Unable to send message.');
        }
    };

    return sendMessage;
};

export default handleOutgoingMessage;

