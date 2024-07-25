import encodeDealRequest from '../../src/messages/encodeDealRequest.js';

const data = {
    amount: {
        mantissa: 12345678n,
        exponent: -2
    },
    currency: 'USD',
    side: 'BUY',
    symbol: 'EURUSD',
    deliveryDate: '20241231',
    transactTime: '20230101-00:00:00.000',
    quoteRequestID: '12345678',
    quoteID: '87654321',
    dealRequestID: '1234-5678',
    fxRate: {
        mantissa: 9876543n,
        exponent: -4
    }
};

try {
    console.log(data);
    const encodedBuffer = encodeDealRequest(data);
    console.log(new Uint8Array(encodedBuffer));
} catch (error) {
    console.error('Encoding failed:', error);
}
