import handleIncomingMessage from '../../src/handlers/handleIncomingMessage.js';
import MessageHeaderEncoder from '../../src/aeron/MessageHeaderEncoder.js';
import QuoteCancelEncoder from '../../src/aeron/v1/QuoteCancelEncoder.js';
import TradeQuoteCancelEncoder from '../../src/aeron/v2/TradeQuoteCancelEncoder.js';
import TradeQuoteEncoder from '../../src/aeron/v2/TradeQuoteEncoder.js';

// Mock TextEncoder & TextDecoder
import TextEncoder from '../aeron/TextEncoder.js';
import TextDecoder from '../aeron/TextDecoder.js';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

describe('handleIncomingMessage cancel handling and precision', () => {
  it('handles schema1/template5 QuoteCancel without unknown-type error', () => {
    const buffer = new ArrayBuffer(QuoteCancelEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH);
    const headerEncoder = new MessageHeaderEncoder();
    const encoder = new QuoteCancelEncoder();

    encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);
    encoder.symbol('EURUSD');
    encoder.transactTime('20260307-20:44:24.073');
    encoder.quoteRequestID('REQ1234567890123');
    encoder.clientID('TEST');

    const mockSetShowQuote = jest.fn();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    handleIncomingMessage(
      buffer,
      jest.fn(),
      mockSetShowQuote,
      jest.fn(),
      jest.fn(),
      jest.fn(),
      jest.fn()
    );

    expect(mockSetShowQuote).toHaveBeenCalledWith(false);
    expect(consoleErrorSpy).not.toHaveBeenCalledWith('Unknown message type:', 5);

    consoleErrorSpy.mockRestore();
  });

  it('handles schema4/template6 TradeQuoteCancel without unknown-type error', () => {
    const buffer = new ArrayBuffer(TradeQuoteCancelEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH);
    const headerEncoder = new MessageHeaderEncoder();
    const encoder = new TradeQuoteCancelEncoder();

    encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);
    encoder.transactionType('SPO');
    encoder.symbol('EURUSD');
    encoder.transactTime('20260307-20:44:24.073');
    encoder.messageTime(BigInt(1772916264404));
    encoder.quoteRequestID('REQ1234567890123');
    encoder.clientID('TEST');

    const mockSetShowQuote = jest.fn();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    handleIncomingMessage(
      buffer,
      jest.fn(),
      mockSetShowQuote,
      jest.fn(),
      jest.fn(),
      jest.fn(),
      jest.fn()
    );

    expect(mockSetShowQuote).toHaveBeenCalledWith(false);
    expect(consoleErrorSpy).not.toHaveBeenCalledWith('Unknown message type:', 6);

    consoleErrorSpy.mockRestore();
  });

  it('clamps displayed v2 quote FX rate to 5 decimals', () => {
    const data = {
      transactionType: 'FWD',
      symbol: 'EURUSD',
      transactTime: '20260307-20:44:24.073',
      messageTime: BigInt(1772916264404),
      quoteID: 'QID123456789012345678901',
      quoteRequestID: 'REQ1234567890123',
      clientID: 'TEST',
      legs: [
        {
          amount: { mantissa: 50000000, exponent: -2 },
          currency: 'USD',
          valueDate: '20260318',
          side: 'BUY',
          spotBid: { mantissa: 108192, exponent: -5 },
          spotOffer: { mantissa: 1084206666667, exponent: -12 },
          fwdBid: { mantissa: 0, exponent: 0 },
          fwdOffer: { mantissa: 0, exponent: 0 },
          bid: { mantissa: 108192, exponent: -5 },
          offer: { mantissa: 1084206666667, exponent: -12 }
        }
      ]
    };

    const bufferLength =
      TradeQuoteEncoder.BLOCK_LENGTH +
      MessageHeaderEncoder.ENCODED_LENGTH +
      4 +
      TradeQuoteEncoder.LEG_BLOCK_LENGTH;

    const buffer = new ArrayBuffer(bufferLength);
    const headerEncoder = new MessageHeaderEncoder();
    const encoder = new TradeQuoteEncoder();
    encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);
    encoder.transactionType(data.transactionType);
    encoder.symbol(data.symbol);
    encoder.transactTime(data.transactTime);
    encoder.messageTime(data.messageTime);
    encoder.quoteID(data.quoteID);
    encoder.quoteRequestID(data.quoteRequestID);
    encoder.clientID(data.clientID);
    encoder.encodeLeg(data.legs);

    const mockSetQuote = jest.fn();
    const mockSetShowQuote = jest.fn();

    handleIncomingMessage(
      buffer,
      mockSetQuote,
      mockSetShowQuote,
      jest.fn(),
      jest.fn(),
      jest.fn(),
      jest.fn()
    );

    expect(mockSetShowQuote).toHaveBeenCalledWith(true);
    const quoteArg = mockSetQuote.mock.calls[0][0];
    expect(quoteArg.fxRate).toMatch(/^\d+\.\d{5}$/);
  });
});
