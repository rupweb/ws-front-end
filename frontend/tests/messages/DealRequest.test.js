import { WebSocketProvider, useWebSocket } from '../../src/handlers/WebSocketContext.js';
import { encodeDealRequest } from '../../src/messages/encodeDealRequest.js';
import { WebSocketServer } from 'ws';
import React from 'react';
import { render, act } from '@testing-library/react';

// Mock WebSocket server setup
const mockServer = new WebSocketServer({ port: 8090 });

mockServer.on('connection', socket => {
    socket.on('message', message => {
        const data = new Uint8Array(message);
        // Handle incoming message, for example, decode and check the content
        console.log('Server received:', data);
    });
});

describe('WebSocket integration test', () => {
    it('sends a DealRequest message via WebSocket', async () => {
        console.log('WebSocket integration test')
        const TestComponent = () => {
            const { sendMessage } = useWebSocket();

            const sendTestMessage = () => {
                const dealRequestData = {
                    amount: { mantissa: 1000, exponent: -2 },
                    currency: 'USD',
                    side: 'BUY',
                    symbol: 'EURUSD',
                    deliveryDate: '2023-01-01',
                    transactTime: '2023-01-01T12:00:00Z',
                    quoteRequestID: 'test-quote-request-id',
                    quoteID: 'test-quote-id',
                    dealRequestID: 'test-deal-request-id',
                    ticketRef: 'test-ticket-ref',
                    fxRate: { mantissa: 100, exponent: -2 }
                };

                const encodedMessage = encodeDealRequest(dealRequestData);
                sendMessage(encodedMessage);
            };

            return <button onClick={sendTestMessage}>Send DealRequest</button>;
        };

        const { getByText } = render(
            <WebSocketProvider url="ws://localhost:8090">
                <TestComponent />
            </WebSocketProvider>
        );

        await act(async () => {
            getByText('Send DealRequest').click();
        });

        // Verify that the message was sent correctly
        // You can use assertions to check the server logs or other means to validate the test
        console.log('Test finished')
    });
});

// Close the mock server after tests
afterAll(() => {
    mockServer.close();
});
