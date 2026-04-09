import React, { createContext, useContext, useCallback, useState } from 'react';
import useWebSocketConnection from '../handlers/handleWebSocketConnection.js';
import incomingMessage from '../handlers/handleIncomingMessage.js';
import outgoingMessage from '../handlers/handleOutgoingMessage.js';
import {
    EMPTY_ERROR,
    EMPTY_EXECUTION_REPORT,
    EMPTY_SALES_QUOTE,
    EMPTY_TRADING_QUOTE
} from '../utils/trading.js';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ url, children }) => {
    const [salesQuote, setSalesQuote] = useState(EMPTY_SALES_QUOTE);
    const [salesExecutionReport, setSalesExecutionReport] = useState(EMPTY_EXECUTION_REPORT);
    const [salesError, setSalesError] = useState(EMPTY_ERROR);
    const [showSalesQuote, setShowSalesQuote] = useState(false);
    const [showSalesExecutionReport, setShowSalesExecutionReport] = useState(false);
    const [showSalesError, setShowSalesError] = useState(false);

    const [tradingQuote, setTradingQuote] = useState(EMPTY_TRADING_QUOTE);
    const [tradingExecutionReport, setTradingExecutionReport] = useState(EMPTY_EXECUTION_REPORT);
    const [tradingError, setTradingError] = useState(EMPTY_ERROR);
    const [showTradingQuote, setShowTradingQuote] = useState(false);
    const [showTradingExecutionReport, setShowTradingExecutionReport] = useState(false);
    const [showTradingError, setShowTradingError] = useState(false);

    const handleIncoming = useCallback((data) => {
        incomingMessage(
            data,
            setSalesQuote,
            setShowSalesQuote,
            setSalesExecutionReport,
            setShowSalesExecutionReport,
            setSalesError,
            setShowSalesError,
            setTradingQuote,
            setShowTradingQuote,
            setTradingExecutionReport,
            setShowTradingExecutionReport,
            setTradingError,
            setShowTradingError
        );
    }, []);

    const socketRef = useWebSocketConnection(url, handleIncoming);
    const sendMessage = outgoingMessage(socketRef);

    return (
        <WebSocketContext.Provider 
            value={{
                sendMessage,
                salesQuote,
                setSalesQuote,
                showSalesQuote,
                setShowSalesQuote,
                salesExecutionReport,
                setSalesExecutionReport,
                showSalesExecutionReport,
                setShowSalesExecutionReport,
                salesError,
                setSalesError,
                showSalesError,
                setShowSalesError,
                tradingQuote,
                setTradingQuote,
                showTradingQuote,
                setShowTradingQuote,
                tradingExecutionReport,
                setTradingExecutionReport,
                showTradingExecutionReport,
                setShowTradingExecutionReport,
                tradingError,
                setTradingError,
                showTradingError,
                setShowTradingError
            }}>
                {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};

