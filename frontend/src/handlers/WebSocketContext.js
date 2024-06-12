import React, { createContext, useContext, useEffect, useRef } from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ url, children }) => {
    const socketRef = useRef(null);
    const pingIntervalRef = useRef(null);

    useEffect(() => {
        console.log('WebSocketProvider mounted');

        const connect = () => {
            console.log('Connecting to WebSocket...');
            const socket = new WebSocket(url);
            socketRef.current = socket;

            socket.onopen = () => {
                console.log('WebSocket connection opened');
                startPing();
                socket.send(JSON.stringify({ type: 'welcome', message: 'Connection established' }));
            };

            socket.onmessage = (event) => {
                console.log('WebSocket message received:', event.data);
            };

            socket.onclose = (event) => {
                console.log('WebSocket connection closed', {
                    code: event.code,
                    reason: event.reason,
                    wasClean: event.wasClean,
                });
                stopPing();
                if (event.code !== 1000) { // Only reconnect if the close was not clean
                    setTimeout(connect, 5000); // Reconnect after 5 seconds
                }
            };

            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        };

        const startPing = () => {
            pingIntervalRef.current = setInterval(() => {
                if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                    socketRef.current.send(JSON.stringify({ type: 'ping' }));
                }
            }, 30000); // Ping every 30 seconds
        };

        const stopPing = () => {
            if (pingIntervalRef.current) {
                clearInterval(pingIntervalRef.current);
                pingIntervalRef.current = null;
            }
        };

        connect();

        return () => {
            console.log('WebSocketProvider unmounted');
            if (socketRef.current) {
                console.log('Closing WebSocket connection due to component unmounting');
                socketRef.current.close(1000, 'Component unmounted'); // Cleanly close the WebSocket
            }
            stopPing();
        };
    }, [url]);

    const sendMessage = (message) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not open. Unable to send message.');
        }
    };

    return (
        <WebSocketContext.Provider value={{ sendMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};
