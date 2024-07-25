import { WebSocketProvider } from './WebSocketContext';
import { decodeQuote } from './QuoteDecoder';
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
        quoteRequestID: 'test-quote-request-id'
    };

    const buffer = new UnsafeBuffer(ByteBuffer.allocateDirect(QuoteDecoder.BLOCK_LENGTH + MessageHeaderDecoder.ENCODED_LENGTH));
    const encoder = new QuoteEncoder();
    const headerEncoder = new MessageHeaderEncoder();
    encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);

    encoder.amount().mantissa(quoteData.amount.mantissa).exponent(quoteData.amount.exponent);
    encoder.currency(quoteData.currency);
    encoder.fxRate().mantissa(quoteData.fxRate.mantissa).exponent(quoteData.fxRate.exponent);
    encoder.transactTime(quoteData.transactTime);
    encoder.side(quoteData.side);
    encoder.symbol(quoteData.symbol);
    encoder.quoteID(quoteData.quoteID);
    encoder.quoteRequestID(quoteData.quoteRequestID);

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
    });
});

// Close the mock server after tests
afterAll(() => {
    mockServer.close();
});
