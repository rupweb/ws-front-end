import { WebSocketProvider } from './WebSocketContext';
import { decodeExecutionReport } from './ExecutionReportDecoder';
import { WebSocketServer } from 'ws';
import React, { useEffect, useState } from 'react';
import { render } from '@testing-library/react';

// Mock WebSocket server setup
const mockServer = new WebSocketServer({ port: 8081 });

const sendMockExecutionReport = () => {
    const executionReportData = {
        amount: { mantissa: 1000, exponent: -2 },
        currency: 'USD',
        secondaryAmount: { mantissa: 2000, exponent: -2 },
        secondaryCurrency: 'EUR',
        side: 'BUY',
        symbol: 'EURUSD',
        deliveryDate: '2023-01-01',
        transactTime: '2023-01-01T12:00:00Z',
        quoteRequestID: 'test-quote-request-id',
        quoteID: 'test-quote-id',
        dealRequestID: 'test-deal-request-id',
        dealID: 'test-deal-id',
        fxRate: { mantissa: 100, exponent: -2 }
    };

    const buffer = new UnsafeBuffer(ByteBuffer.allocateDirect(ExecutionReportDecoder.BLOCK_LENGTH + MessageHeaderDecoder.ENCODED_LENGTH));
    const encoder = new ExecutionReportEncoder();
    const headerEncoder = new MessageHeaderEncoder();
    encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);

    encoder.amount().mantissa(executionReportData.amount.mantissa).exponent(executionReportData.amount.exponent);
    encoder.currency(executionReportData.currency);
    encoder.secondaryAmount().mantissa(executionReportData.secondaryAmount.mantissa).exponent(executionReportData.secondaryAmount.exponent);
    encoder.secondaryCurrency(executionReportData.secondaryCurrency);
    encoder.side(executionReportData.side);
    encoder.symbol(executionReportData.symbol);
    encoder.deliveryDate(executionReportData.deliveryDate);
    encoder.transactTime(executionReportData.transactTime);
    encoder.quoteRequestID(executionReportData.quoteRequestID);
    encoder.quoteID(executionReportData.quoteID);
    encoder.dealRequestID(executionReportData.dealRequestID);
    encoder.dealID(executionReportData.dealID);
    encoder.fxRate().mantissa(executionReportData.fxRate.mantissa).exponent(executionReportData.fxRate.exponent);

    mockServer.clients.forEach(client => {
        client.send(buffer.byteArray());
    });
};

mockServer.on('connection', socket => {
    sendMockExecutionReport();
});

describe('WebSocket integration test', () => {
    it('receives an ExecutionReport message via WebSocket', async () => {
        const TestComponent = () => {
            const [executionReport, setExecutionReport] = useState(null);

            useEffect(() => {
                const handleExecutionReport = (data) => {
                    const decodedExecutionReport = decodeExecutionReport(data);
                    setExecutionReport(decodedExecutionReport);
                };

                // Use the WebSocket context's method to receive messages
                useWebSocket().addMessageHandler(handleExecutionReport);

                return () => {
                    useWebSocket().removeMessageHandler(handleExecutionReport);
                };
            }, []);

            return <div>{executionReport ? `Received ExecutionReport: ${JSON.stringify(executionReport)}` : 'Waiting for ExecutionReport...'}</div>;
        };

        const { getByText } = render(
            <WebSocketProvider url="ws://localhost:8081">
                <TestComponent />
            </WebSocketProvider>
        );

        expect(getByText(/Waiting for ExecutionReport.../)).toBeInTheDocument();

        // Wait for the mock execution report to be received
        await new Promise((resolve) => setTimeout(resolve, 1000));

        expect(getByText(/Received ExecutionReport:/)).toBeInTheDocument();
    });
});

// Close the mock server after tests
afterAll(() => {
    mockServer.close();
});
