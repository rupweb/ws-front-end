import { WebSocketProvider, useWebSocket } from '../../src/handlers/WebSocketContext.js';
import { decodeQuote } from '../../src/aeron/js/QuoteDecoder.js';
import { WebSocketServer } from 'ws';
import React, { useEffect, useState } from 'react';
import { render } from '@testing-library/react';

// Mock WebSocket server setup
const mockServer = new WebSocketServer({ port: 8090 });

const sendMockQuote = () => {
    const quoteData = {
        amount: { mantissa: 1000, exponent: -2 },
        currency: 'USD',
        fxRate: { mantissa: 100, exponent: -2 },
        transactTime: '2023-01-01T12:00:00Z',
        side: 'BUY',
        symbol: 'EURUSD',
        quoteID: 'test-quote-id',
        quoteRequestID: 'test-quote-request-id',
        secondaryAmount: { mantissa: 100, exponent: -2 },
    };

    const buffer = new UnsafeBuffer(ByteBuffer.allocateDirect(QuoteDecoder.BLOCK_LENGTH + MessageHeaderDecoder.ENCODED_LENGTH));
    const encoder = new QuoteEncoder();
    const headerEncoder = new MessageHeaderEncoder();

    // Encode the quote
    encoder.wrapAndApplyHeader(data, 0, headerEncoder);
    encoder.encodeamount(data.amount);
    encoder.currency(data.currency);
    encoder.side(data.side);
    encoder.symbol(data.symbol);
    encoder.transactTime(data.transactTime);
    encoder.quoteID(data.quoteID);
    encoder.quoteRequestID(data.quoteRequestID);
    encoder.encodefxRate(data.fxRate);
    encoder.encodesecondaryAmount(data.secondaryAmount);

    mockServer.clients.forEach(client => {
        client.send(buffer.byteArray());
    });
};

mockServer.on('connection', socket => {
    sendMockQuote();
});

describe('WebSocket integration test', () => {
    it('receives a Quote message via WebSocket', async () => {
        const TestComponent = () => {
            const [quote, setQuote] = useState(null);

            useEffect(() => {
                const handleQuote = (data) => {
                    const decodedQuote = decodeQuote(data);
                    setQuote(decodedQuote);
                };

                // Use the WebSocket context's method to receive messages
                useWebSocket().addMessageHandler(handleQuote);

                return () => {
                    useWebSocket().removeMessageHandler(handleQuote);
                };
            }, []);

            return <div>{quote ? `Received Quote: ${JSON.stringify(quote)}` : 'Waiting for Quote...'}</div>;
        };

        const { getByText } = render(
            <WebSocketProvider url="ws://localhost:8090">
                <TestComponent />
            </WebSocketProvider>
        );

        expect(getByText(/Waiting for Quote.../)).toBeInTheDocument();

        // Wait for the mock quote to be received
        await new Promise((resolve) => setTimeout(resolve, 1000));

        expect(getByText(/Received Quote:/)).toBeInTheDocument();

        console.log('Test finished')
    });
});

// Close the mock server after tests
afterAll(() => {
    mockServer.close();
});
