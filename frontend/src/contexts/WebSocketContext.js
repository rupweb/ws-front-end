import React, { createContext, useContext, useState } from 'react';
import useWebSocketConnection from '../handlers/handleWebSocketConnection.js';
import incomingMessage from '../handlers/handleIncomingMessage.js';
import outgoingMessage from '../handlers/handleOutgoingMessage.js';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ url, children }) => {

    // local state variable for quotes
    const [quoteData, setQuoteData] = useState({
        conversionRate: 0,
        convertedAmount: 0,
        fromCurrency: '',
      });

    const socketRef = useWebSocketConnection(url, (data) => incomingMessage(data, setQuoteData));
    const sendMessage = outgoingMessage(socketRef);

    return (
        <WebSocketContext.Provider value={{ sendMessage, quoteData, setQuoteData }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};

