const handleOutgoingMessage = (socketRef) => {
    const sendMessage = (message) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            if (message instanceof Buffer) {
                socketRef.current.send(message);
            } else {
                socketRef.current.send(JSON.stringify(message));
            }
        } else {
            console.error('WebSocket is not open. Unable to send message.');
        }
    };

    return sendMessage;
};

export default handleOutgoingMessage;
