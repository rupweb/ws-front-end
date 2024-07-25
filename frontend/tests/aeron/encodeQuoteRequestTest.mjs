import encodeQuoteRequest from '../../src/messages/encodeQuoteRequest.js';

const data = {
    amount: {
        mantissa: 12345678n,
        exponent: -2
    },
    saleCurrency: 'USD',
    side: 'BUY',
    symbol: 'EURUSD',
    deliveryDate: '20241231',
    transactTime: '20230101-00:00:00.000',
    quoteRequestID: '12345678',
    currencyOwned: 'EUR',
    kycStatus: 1
};

try {
    console.log(data);
    const encodedBuffer = encodeQuoteRequest(data);
    console.log(new Uint8Array(encodedBuffer));
} catch (error) {
    console.error('Encoding failed:', error);
}
