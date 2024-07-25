import React, { createContext, useContext } from 'react';
import webSocketConnection from './handleWebSocketConnection.js';
import incomingMessage from './handleIncomingMessage.js';
import outgoingMessage from './handleOutgoingMessage.js';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ url, children }) => {
    const socketRef = webSocketConnection(url, incomingMessage);
    const sendMessage = outgoingMessage(socketRef);

    return (
        <WebSocketContext.Provider value={{ sendMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};

