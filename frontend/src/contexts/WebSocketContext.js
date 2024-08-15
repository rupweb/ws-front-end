import React, { createContext, useContext, useState } from 'react';
import useWebSocketConnection from '../handlers/handleWebSocketConnection.js';
import incomingMessage from '../handlers/handleIncomingMessage.js';
import outgoingMessage from '../handlers/handleOutgoingMessage.js';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ url, children }) => {

    // local state variable for incoming quotes
    const [quoteData, setQuoteData] = useState({
        fxRate: 0,
        secondaryAmount: 0,
        symbol: ''
      });

    // local state variable for incoming deals
    const [dealData, setDealData] = useState({
        dealRate: 0,
        secondaryAmount: 0,
        dealID: ''
      });

    const socketRef = useWebSocketConnection(url, (data) => incomingMessage(data, setQuoteData, setDealData));
    const sendMessage = outgoingMessage(socketRef);

    return (
        <WebSocketContext.Provider 
            value={{
                sendMessage,
                quoteData,
                setQuoteData,
                dealData,
                setDealData
            }}>
                {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};

