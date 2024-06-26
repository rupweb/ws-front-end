import React, { createContext, useContext } from 'react';
import webSocketConnection from './handleWebSocketConnection';
import incomingMessage from './handleIncomingMessage';
import outgoingMessage from './handleOutgoingMessage';

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

