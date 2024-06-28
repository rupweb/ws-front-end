import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { WebSocketServer } from 'jest-websocket-mock';
import { WebSocketProvider, useWebSocket } from '../src/handlers/WebSocketContext';
import { encodeDealRequest } from '../src/messages/encodeDealRequest';

jest.mock('../src/messages/encodeDealRequest', () => ({
    encodeDealRequest: jest.fn(() => new Uint8Array([1, 2, 3, 4])) // Mock the encoded message
}));

jest.mock('../src/messages/MessageHeaderDecoder', () => require('../../mocks/MessageHeaderDecoder'));

// Test component that uses the WebSocket context
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

describe('WebSocket integration test', () => {
    let server;

    beforeEach(() => {
        server = new WebSocketServer('ws://localhost:8081');
    });

    afterEach(() => {
        server.close();
    });

    it.only('sends a DealRequest message via WebSocket', async () => {
        const { getByText } = render(
            <WebSocketProvider url="ws://localhost:8081">
                <TestComponent />
            </WebSocketProvider>
        );

        await act(async () => {
            fireEvent.click(getByText('Send DealRequest'));
        });

        // Verify that the message was sent correctly
        await expect(server).toReceiveMessage(new Uint8Array([1, 2, 3, 4]));

        // You can also verify the content of the message here if necessary
    });
});
