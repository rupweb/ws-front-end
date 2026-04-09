import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TradeEntry from '../../src/components/TradeEntry.js';

jest.mock('../../src/hooks/useTradeEntry.js', () => jest.fn());

import useTradeEntry from '../../src/hooks/useTradeEntry.js';

describe('TradeEntry', () => {
  it('renders symbol and constrained currency dropdowns plus per-leg quote rows', () => {
    const setSymbol = jest.fn();
    const handleTradeCurrencyChange = jest.fn();

    useTradeEntry.mockReturnValue({
      transactionType: 'MUL',
      setTransactionType: jest.fn(),
      symbol: 'USDEUR',
      setSymbol,
      symbolOptions: ['EURUSD', 'USDEUR'],
      currencyOptions: ['USD', 'EUR'],
      legs: [
        { side: 'BUY', amount: '10000', currency: 'USD', date: new Date('2026-04-13') },
        { side: 'SELL', amount: '5000', currency: 'USD', date: new Date('2026-04-20') }
      ],
      setLegs: jest.fn(),
      handleTradeCurrencyChange,
      clientIDMessage: '',
      showClientID: false,
      handleClientIDModalClose: jest.fn(),
      quote: {
        symbol: 'USDEUR',
        quoteID: 'QID1',
        quoteRequestID: 'REQ1',
        legs: [
          {
            amount: { mantissa: 1000000, exponent: -2 },
            currency: 'USD',
            valueDate: '20260413',
            side: 'BUY',
            bid: { mantissa: 92000, exponent: -5 },
            offer: { mantissa: 93000, exponent: -5 }
          },
          {
            amount: { mantissa: 500000, exponent: -2 },
            currency: 'USD',
            valueDate: '20260420',
            side: 'SELL',
            bid: { mantissa: 91800, exponent: -5 },
            offer: { mantissa: 92800, exponent: -5 }
          }
        ]
      },
      showQuote: true,
      handleQuoteRequest: jest.fn(),
      handleQuoteCancel: jest.fn(),
      handleDealRequest: jest.fn(),
      executionReport: null,
      showExecutionReport: false,
      executionReportMessage: '',
      handleExecutionModalClose: jest.fn(),
      error: null,
      showError: false,
      errorMessage: '',
      handleErrorModalClose: jest.fn(),
      handleReset: jest.fn()
    });

    render(<TradeEntry amplifyUsername="TEST" />);

    expect(screen.getByLabelText(/symbol/i)).toHaveValue('USDEUR');
    expect(screen.getAllByLabelText(/currency/i)[0]).toHaveValue('USD');
    expect(screen.getByText(/Leg 1: BUY 10000\.00 USD 20260413 @ 0\.93000 = 9300\.00 EUR/i)).toBeInTheDocument();
    expect(screen.getByText(/Leg 2: SELL 5000\.00 USD 20260420 @ 0\.91800 = 4590\.00 EUR/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/symbol/i), { target: { value: 'EURUSD' } });
    expect(setSymbol).toHaveBeenCalledWith('EURUSD');

    fireEvent.change(screen.getAllByLabelText(/currency/i)[0], { target: { value: 'EUR' } });
    expect(handleTradeCurrencyChange).toHaveBeenCalledWith('EUR');
  });
});
