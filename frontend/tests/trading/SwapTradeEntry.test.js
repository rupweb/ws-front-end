import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import SwapTradeEntry from '../../src/components/SwapTradeEntry';
import { addBusinessDays } from '../../src/utils/utils';

describe('SwapTradeEntry', () => {
  it('renders two legs and handles updates correctly', () => {
    const mockHandleQuoteRequest = jest.fn();
    const mockSetLegs = jest.fn();

    const today = new Date();
    const minDate = addBusinessDays(today, 2);
    const maxDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

    const leg1Date = addBusinessDays(today, 5);
    const leg2Date = addBusinessDays(today, 30);

    const legs = [
      { side: 'BUY', amount: '100000', currency: 'USD', date: leg1Date },
      { side: 'SELL', amount: '100000', currency: 'USD', date: leg2Date }
    ];

    render(
      <SwapTradeEntry
        legs={legs}
        setLegs={mockSetLegs}
        minDate={minDate}
        maxDate={maxDate}
        handleQuoteRequest={mockHandleQuoteRequest}
      />
    );

    const sideSelects = screen.getAllByLabelText(/side/i);
    const amountInputs = screen.getAllByLabelText(/amount/i);
    const dateInputs = screen.getAllByLabelText(/date/i);

    expect(sideSelects).toHaveLength(2);
    expect(sideSelects[0].value).toBe('BUY');
    expect(sideSelects[1].value).toBe('SELL');
    expect(amountInputs[0].value).toBe('100000');
    expect(amountInputs[1].value).toBe('100000');
    expect(dateInputs[0].value).toBe(leg1Date.toISOString().substring(0, 10));
    expect(dateInputs[1].value).toBe(leg2Date.toISOString().substring(0, 10));

    // Change side of leg 1 to SELL (should auto-flip leg 2 to BUY)
    fireEvent.change(sideSelects[0], { target: { value: 'SELL' } });
    expect(mockSetLegs).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ side: 'SELL' }),
        expect.objectContaining({ side: 'BUY' })
      ])
    );

    fireEvent.click(screen.getByText(/request/i));
    expect(mockHandleQuoteRequest).toHaveBeenCalled();
  });
});
