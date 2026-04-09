import handleIncomingMessage from '../../src/handlers/handleIncomingMessage.js';
import MessageHeaderEncoder from '../../src/aeron/MessageHeaderEncoder.js';
import TradeQuoteEncoder from '../../src/aeron/v2/TradeQuoteEncoder.js';
import QuoteEncoder from '../../src/aeron/v1/QuoteEncoder.js';

import TextEncoder from '../aeron/TextEncoder.js';
import TextDecoder from '../aeron/TextDecoder.js';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

describe('handleIncomingMessage state isolation', () => {
  it('routes schema4 trade quotes to trading state only', () => {
    const bufferLength =
      TradeQuoteEncoder.BLOCK_LENGTH +
      MessageHeaderEncoder.ENCODED_LENGTH +
      4 +
      TradeQuoteEncoder.LEG_BLOCK_LENGTH;
    const buffer = new ArrayBuffer(bufferLength);
    const headerEncoder = new MessageHeaderEncoder();
    const encoder = new TradeQuoteEncoder();

    encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);
    encoder.transactionType('SWA');
    encoder.symbol('EURUSD');
    encoder.transactTime('20260409-10:58:34.117');
    encoder.messageTime(BigInt(1775732315000));
    encoder.quoteID('QID123456789012345678901');
    encoder.quoteRequestID('REQ1234567890123');
    encoder.clientID('TEST');
    encoder.encodeLeg([{
      amount: { mantissa: 1000000000, exponent: -2 },
      currency: 'USD',
      valueDate: '20260413',
      side: 'BUY',
      spotBid: { mantissa: 107992, exponent: -5 },
      spotOffer: { mantissa: 108692, exponent: -5 },
      fwdBid: { mantissa: 107992, exponent: -5 },
      fwdOffer: { mantissa: 108692, exponent: -5 },
      bid: { mantissa: 107992, exponent: -5 },
      offer: { mantissa: 108692, exponent: -5 }
    }]);

    const salesSetQuote = jest.fn();
    const salesSetShowQuote = jest.fn();
    const tradingSetQuote = jest.fn();
    const tradingSetShowQuote = jest.fn();

    handleIncomingMessage(
      buffer,
      salesSetQuote,
      salesSetShowQuote,
      jest.fn(),
      jest.fn(),
      jest.fn(),
      jest.fn(),
      tradingSetQuote,
      tradingSetShowQuote,
      jest.fn(),
      jest.fn(),
      jest.fn(),
      jest.fn()
    );

    expect(salesSetQuote).not.toHaveBeenCalled();
    expect(salesSetShowQuote).not.toHaveBeenCalled();
    expect(tradingSetQuote).toHaveBeenCalled();
    expect(tradingSetShowQuote).toHaveBeenCalledWith(true);
  });

  it('routes schema1 sales quotes to sales state only', () => {
    const buffer = new ArrayBuffer(QuoteEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH);
    const headerEncoder = new MessageHeaderEncoder();
    const encoder = new QuoteEncoder();

    encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);
    encoder.encodeamount({ mantissa: 100000000, exponent: -2 });
    encoder.currency('USD');
    encoder.side('BUY');
    encoder.symbol('EURUSD');
    encoder.transactTime('20260409-10:58:34.117');
    encoder.quoteID('QID123456789012');
    encoder.quoteRequestID('REQ123456789012');
    encoder.encodefxRate({ mantissa: 108692, exponent: -5 });
    encoder.encodesecondaryAmount({ mantissa: 100000000, exponent: -2 });
    encoder.clientID('TEST');

    const salesSetQuote = jest.fn();
    const salesSetShowQuote = jest.fn();
    const tradingSetQuote = jest.fn();
    const tradingSetShowQuote = jest.fn();

    handleIncomingMessage(
      buffer,
      salesSetQuote,
      salesSetShowQuote,
      jest.fn(),
      jest.fn(),
      jest.fn(),
      jest.fn(),
      tradingSetQuote,
      tradingSetShowQuote,
      jest.fn(),
      jest.fn(),
      jest.fn(),
      jest.fn()
    );

    expect(salesSetQuote).toHaveBeenCalled();
    expect(salesSetShowQuote).toHaveBeenCalledWith(true);
    expect(tradingSetQuote).not.toHaveBeenCalled();
    expect(tradingSetShowQuote).not.toHaveBeenCalled();
  });
});
