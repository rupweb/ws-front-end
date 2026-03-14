import handleIncomingMessage from '../../src/handlers/handleIncomingMessage.js';
import MessageHeaderEncoder from '../../src/aeron/MessageHeaderEncoder.js';
import TradeQuoteRequestEncoder from '../../src/aeron/v2/TradeQuoteRequestEncoder.js';
import TradeDealRequestEncoder from '../../src/aeron/v2/TradeDealRequestEncoder.js';

import TextEncoder from '../aeron/TextEncoder.js';
import TextDecoder from '../aeron/TextDecoder.js';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

describe('handleIncomingMessage trade request echoes', () => {
  it('ignores schema4/template1 TradeQuoteRequest echoes without unknown-type error', () => {
    const bufferLength =
      TradeQuoteRequestEncoder.BLOCK_LENGTH +
      MessageHeaderEncoder.ENCODED_LENGTH +
      4 +
      TradeQuoteRequestEncoder.LEG_BLOCK_LENGTH;
    const buffer = new ArrayBuffer(bufferLength);
    const headerEncoder = new MessageHeaderEncoder();
    const encoder = new TradeQuoteRequestEncoder();

    encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);
    encoder.header('REQUEST');
    encoder.transactionType('SPO');
    encoder.symbol('EURUSD');
    encoder.transactTime('20260314-10:15:30.000');
    encoder.messageTime(BigInt(1773483330000));
    encoder.quoteRequestID('REQ1234567890123');
    encoder.clientID('TEST');
    encoder.encodeLeg([{
      amount: { mantissa: 50000000, exponent: -2 },
      currency: 'USD',
      valueDate: '20260318',
      side: 'BUY'
    }]);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockSetQuote = jest.fn();
    const mockSetShowQuote = jest.fn();
    const mockSetExecutionReport = jest.fn();
    const mockSetShowExecutionReport = jest.fn();
    const mockSetError = jest.fn();
    const mockSetShowError = jest.fn();

    handleIncomingMessage(
      buffer,
      mockSetQuote,
      mockSetShowQuote,
      mockSetExecutionReport,
      mockSetShowExecutionReport,
      mockSetError,
      mockSetShowError
    );

    expect(consoleErrorSpy).not.toHaveBeenCalledWith('Unknown message type:', 1);
    expect(mockSetQuote).not.toHaveBeenCalled();
    expect(mockSetShowQuote).not.toHaveBeenCalled();
    expect(mockSetExecutionReport).not.toHaveBeenCalled();
    expect(mockSetShowExecutionReport).not.toHaveBeenCalled();
    expect(mockSetError).not.toHaveBeenCalled();
    expect(mockSetShowError).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('ignores schema4/template3 TradeDealRequest echoes without unknown-type error', () => {
    const bufferLength =
      TradeDealRequestEncoder.BLOCK_LENGTH +
      MessageHeaderEncoder.ENCODED_LENGTH +
      4 +
      TradeDealRequestEncoder.LEG_BLOCK_LENGTH;
    const buffer = new ArrayBuffer(bufferLength);
    const headerEncoder = new MessageHeaderEncoder();
    const encoder = new TradeDealRequestEncoder();

    encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);
    encoder.header('REQUEST');
    encoder.transactionType('SPO');
    encoder.symbol('EURUSD');
    encoder.transactTime('20260314-10:15:30.000');
    encoder.messageTime(BigInt(1773483330000));
    encoder.quoteRequestID('REQ1234567890123');
    encoder.quoteID('QID123456789012345678901');
    encoder.dealRequestID('DEAL123456789012');
    encoder.clientID('TEST');
    encoder.encodeLeg([{
      amount: { mantissa: 50000000, exponent: -2 },
      currency: 'USD',
      valueDate: '20260318',
      side: 'BUY',
      spot: { mantissa: 108192, exponent: -5 },
      fwd: { mantissa: 0, exponent: 0 },
      price: { mantissa: 108192, exponent: -5 }
    }]);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockSetQuote = jest.fn();
    const mockSetShowQuote = jest.fn();
    const mockSetExecutionReport = jest.fn();
    const mockSetShowExecutionReport = jest.fn();
    const mockSetError = jest.fn();
    const mockSetShowError = jest.fn();

    handleIncomingMessage(
      buffer,
      mockSetQuote,
      mockSetShowQuote,
      mockSetExecutionReport,
      mockSetShowExecutionReport,
      mockSetError,
      mockSetShowError
    );

    expect(consoleErrorSpy).not.toHaveBeenCalledWith('Unknown message type:', 3);
    expect(mockSetQuote).not.toHaveBeenCalled();
    expect(mockSetShowQuote).not.toHaveBeenCalled();
    expect(mockSetExecutionReport).not.toHaveBeenCalled();
    expect(mockSetShowExecutionReport).not.toHaveBeenCalled();
    expect(mockSetError).not.toHaveBeenCalled();
    expect(mockSetShowError).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
