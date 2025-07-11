import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import MultiLegTradeEntry from '../../src/components/MultiLegTradeEntry';
import { addBusinessDays } from '../../src/utils/utils';

describe('MultiLegTradeEntry', () => {
  it('renders 4 legs and handles updates correctly', () => {
    const mockHandleQuoteRequest = jest.fn();
    const mockSetLegs = jest.fn();

    const today = new Date();
    const minDate = addBusinessDays(today, 2);
    const maxDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

    const legs = [
      { side: 'BUY', amount: '10000', currency: 'USD', date: addBusinessDays(today, 3) },
      { side: 'SELL', amount: '2500', currency: 'USD', date: addBusinessDays(today, 10) },
      { side: 'BUY', amount: '3500', currency: 'USD', date: addBusinessDays(today, 20) },
      { side: 'SELL', amount: '3000', currency: 'USD', date: addBusinessDays(today, 30) }
    ];

    render(
      <MultiLegTradeEntry
        legs={legs}
        setLegs={mockSetLegs}
        minDate={minDate}
        maxDate={maxDate}
        handleQuoteRequest={mockHandleQuoteRequest}
      />
    );

    // Confirm 4 leg forms are present
    const amountInputs = screen.getAllByLabelText(/amount/i);
    expect(amountInputs).toHaveLength(4);

    // Confirm sides are alternating
    const sideSelects = screen.getAllByLabelText(/side/i);
    expect(sideSelects[0].value).toBe('BUY');
    expect(sideSelects[1].value).toBe('SELL');
    expect(sideSelects[2].value).toBe('BUY');
    expect(sideSelects[3].value).toBe('SELL');

    // Confirm currency inputs are fixed to USD
    const currencyInputs = screen.getAllByLabelText(/currency/i);
    currencyInputs.forEach(input => {
      expect(input.value).toBe('USD');
    });

    const dateInputs = screen.getAllByLabelText(/date/i);
    expect(dateInputs[0].value).toBe(addBusinessDays(today, 3).toISOString().substring(0, 10));
    expect(dateInputs[1].value).toBe(addBusinessDays(today, 10).toISOString().substring(0, 10));
    expect(dateInputs[2].value).toBe(addBusinessDays(today, 20).toISOString().substring(0, 10));
    expect(dateInputs[3].value).toBe(addBusinessDays(today, 30).toISOString().substring(0, 10));

    // Change amount on leg 1
    fireEvent.change(amountInputs[0], { target: { value: '15000' } });
    expect(mockSetLegs).toHaveBeenCalledWith(expect.any(Array));

    // Trigger quote request
    const requestButton = screen.getByText(/request/i);
    fireEvent.click(requestButton);
    expect(mockHandleQuoteRequest).toHaveBeenCalled();
  });
});
