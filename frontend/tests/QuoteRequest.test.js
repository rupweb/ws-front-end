import { WebSocketProvider, useWebSocket } from './WebSocketContext';
import { encodeQuoteRequest } from './QuoteRequestEncoder';
import { WebSocketServer } from 'ws';
import React from 'react';
import { render, act } from '@testing-library/react';

// Mock WebSocket server setup
const mockServer = new WebSocketServer({ port: 8081 });

mockServer.on('connection', socket => {
    socket.on('message', message => {
        const data = new Uint8Array(message);
        // Handle incoming message, for example, decode and check the content
        console.log('Server received:', data);
    });
});

describe('WebSocket integration test', () => {
    it('sends a QuoteRequest message via WebSocket', async () => {
        const TestComponent = () => {
            const { sendMessage } = useWebSocket();

            const sendTestMessage = () => {
                const quoteRequestData = {
                    amount: { mantissa: 1000, exponent: -2 },
                    saleCurrency: 'USD',
                    deliveryDate: '2023-01-01',
                    transactTime: '2023-01-01T12:00:00Z',
                    quoteRequestID: 'test-quote-request-id',
                    side: 'BUY',
                    symbol: 'EURUSD',
                    currencyOwned: 'EUR',
                    kycStatus: 2
                };

                const encodedMessage = encodeQuoteRequest(quoteRequestData);
                sendMessage(encodedMessage);
            };

            return <button onClick={sendTestMessage}>Send Message</button>;
        };

        const { getByText } = render(
            <WebSocketProvider url="ws://localhost:8081">
                <TestComponent />
            </WebSocketProvider>
        );

        await act(async () => {
            getByText('Send Message').click();
        });

        // Verify that the message was sent correctly
        // You can use assertions to check the server logs or other means to validate the test
    });
});

// Close the mock server after tests
afterAll(() => {
    mockServer.close();
});
