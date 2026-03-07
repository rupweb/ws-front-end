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

describe('handleDealRequestV2', () => {
  it('uses quoted BUY leg prices (offer side) instead of zero defaults', async () => {
    const sendMessage = jest.fn();

    const quote = {
      legs: [
        {
          currency: 'USD',
          spotBid: { mantissa: 108192, exponent: -5 },
          spotOffer: { mantissa: 108492, exponent: -5 },
          fwdBid: { mantissa: 0, exponent: 0 },
          fwdOffer: { mantissa: 0, exponent: 0 },
          bid: { mantissa: 108192, exponent: -5 },
          offer: { mantissa: 108492, exponent: -5 }
        }
      ]
    };

    const legs = [
      {
        amount: '200000',
        currency: 'USD',
        side: 'BUY',
        date: '2026-03-18'
      }
    ];

    await handleDealRequestV2({
      transactionType: 'SPO',
      symbol: 'EURUSD',
      clientID: 'TEST',
      quoteRequestID: 'QREQ123456789012',
      quoteID: 'QREQ123456789012.1',
      quote,
      legs,
      sendMessage
    });

    expect(encodeDealRequest).toHaveBeenCalledTimes(1);
    const payload = encodeDealRequest.mock.calls[0][0];

    expect(payload.dealRequestID).toBe('DEALREQ123456');
    expect(payload.legs[0].spot).toEqual(quote.legs[0].spotOffer);
    expect(payload.legs[0].price).toEqual(quote.legs[0].offer);
    expect(payload.legs[0].spot).not.toEqual({ mantissa: 0, exponent: -1 });
    expect(payload.legs[0].price).not.toEqual({ mantissa: 0, exponent: -1 });
    expect(sendMessage).toHaveBeenCalledWith('encoded-buffer');
  });
});
