jest.mock('../../src/messages/encodeDealRequestV2.js', () => jest.fn(() => 'encoded-buffer'));
jest.mock('../../src/utils/utils.js', () => {
  const actual = jest.requireActual('../../src/utils/utils.js');
  return {
    ...actual,
    generateUUID: () => 'DEALREQ123456'
  };
});

import handleDealRequestV2 from '../../src/handlers/handleDealRequestV2.js';
import encodeDealRequest from '../../src/messages/encodeDealRequestV2.js';

const baseQuoteLeg = {
  currency: 'USD',
  spotBid: { mantissa: 108192, exponent: -5 },
  spotOffer: { mantissa: 108492, exponent: -5 },
  fwdBid: { mantissa: 10, exponent: -5 },
  fwdOffer: { mantissa: 20, exponent: -5 },
  bid: { mantissa: 108192, exponent: -5 },
  offer: { mantissa: 108492, exponent: -5 }
};

describe('handleDealRequestV2', () => {
  beforeEach(() => {
    encodeDealRequest.mockClear();
  });

  it.each([
    ['EURUSD', 'EUR', 'BUY', 'offer', 'spotOffer', 'fwdOffer'],
    ['EURUSD', 'EUR', 'SELL', 'bid', 'spotBid', 'fwdBid'],
    ['EURUSD', 'USD', 'BUY', 'bid', 'spotBid', 'fwdBid'],
    ['EURUSD', 'USD', 'SELL', 'offer', 'spotOffer', 'fwdOffer'],
    ['USDEUR', 'USD', 'BUY', 'offer', 'spotOffer', 'fwdOffer'],
    ['USDEUR', 'USD', 'SELL', 'bid', 'spotBid', 'fwdBid'],
    ['USDEUR', 'EUR', 'BUY', 'bid', 'spotBid', 'fwdBid'],
    ['USDEUR', 'EUR', 'SELL', 'offer', 'spotOffer', 'fwdOffer']
  ])('uses correct executable fields for %s quoted in %s on %s', async (symbol, currency, side, priceField, spotField, fwdField) => {
    const sendMessage = jest.fn();

    await handleDealRequestV2({
      transactionType: 'SWA',
      symbol,
      clientID: 'TEST',
      quoteRequestID: 'QREQ123456789012',
      quoteID: 'QREQ123456789012.1',
      quote: { legs: [baseQuoteLeg] },
      legs: [{
        amount: '200000',
        currency,
        side,
        date: '2026-03-18'
      }],
      sendMessage
    });

    const payload = encodeDealRequest.mock.calls[0][0];
    expect(payload.dealRequestID).toBe('DEALREQ123456');
    expect(payload.legs[0].price).toEqual(baseQuoteLeg[priceField]);
    expect(payload.legs[0].spot).toEqual(baseQuoteLeg[spotField]);
    expect(payload.legs[0].fwd).toEqual(baseQuoteLeg[fwdField]);
    expect(sendMessage).toHaveBeenCalledWith('encoded-buffer');
  });
});
