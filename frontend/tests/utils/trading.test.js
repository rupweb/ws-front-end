import {
  TRADE_SYMBOLS,
  buildTradeQuoteRows,
  getExecutableTradePrice,
  getTradeSymbolCurrencies
} from '../../src/utils/trading.js';

describe('trading utils', () => {
  it('exposes canonical and inverse trade symbols', () => {
    expect(TRADE_SYMBOLS).toEqual(expect.arrayContaining([
      'EURUSD',
      'USDEUR',
      'GBPUSD',
      'USDGBP',
      'USDCAD',
      'CADUSD'
    ]));
  });

  it('restricts trade currencies to the selected symbol pair', () => {
    expect(getTradeSymbolCurrencies('USDEUR')).toEqual(['USD', 'EUR']);
    expect(getTradeSymbolCurrencies('GBPCAD')).toEqual(['GBP', 'CAD']);
  });

  it('selects executable all-in prices using side plus quoted currency', () => {
    const quotedLeg = {
      currency: 'USD',
      side: 'BUY',
      bid: { mantissa: 108192, exponent: -5 },
      offer: { mantissa: 108692, exponent: -5 }
    };

    expect(getExecutableTradePrice({
      quotedLeg,
      symbol: 'EURUSD',
      side: 'BUY',
      currency: 'EUR'
    })).toEqual(quotedLeg.offer);

    expect(getExecutableTradePrice({
      quotedLeg,
      symbol: 'EURUSD',
      side: 'SELL',
      currency: 'EUR'
    })).toEqual(quotedLeg.bid);

    expect(getExecutableTradePrice({
      quotedLeg,
      symbol: 'EURUSD',
      side: 'BUY',
      currency: 'USD'
    })).toEqual(quotedLeg.bid);

    expect(getExecutableTradePrice({
      quotedLeg,
      symbol: 'EURUSD',
      side: 'SELL',
      currency: 'USD'
    })).toEqual(quotedLeg.offer);
  });

  it('builds per-leg trade quote rows for inverse symbols', () => {
    const rows = buildTradeQuoteRows({
      symbol: 'USDEUR',
      quoteID: 'QID1',
      legs: [
        {
          amount: { mantissa: 300000000, exponent: -2 },
          currency: 'USD',
          valueDate: '20260413',
          side: 'BUY',
          bid: { mantissa: 92000, exponent: -5 },
          offer: { mantissa: 93000, exponent: -5 }
        }
      ]
    });

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      side: 'BUY',
      amount: '3000000.00',
      currency: 'USD',
      valueDate: '20260413',
      rate: '0.93000',
      counterCurrency: 'EUR'
    });
  });
});
