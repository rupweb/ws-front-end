import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import SpotTradeEntry from '../../src/components/SpotTradeEntry';
import { addBusinessDays } from '../../src/utils/utils';

describe('SpotTradeEntry', () => {
  it('renders single leg and handles updates correctly', () => {
    const mockHandleQuoteRequest = jest.fn();
    const mockSetLegs = jest.fn();

    const today = new Date();
    const minDate = addBusinessDays(today, 2);
    const maxDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

    const leg = {
      side: 'BUY',
      amount: '50000',
      currency: 'USD',
      date: minDate
    };

    render(
      <SpotTradeEntry
        legs={[leg]}
        setLegs={mockSetLegs}
        minDate={minDate}
        maxDate={maxDate}
        handleQuoteRequest={mockHandleQuoteRequest}
      />
    );

    const sideSelect = screen.getByLabelText(/side/i);
    const amountInput = screen.getByLabelText(/amount/i);
    const currencyInput = screen.getByLabelText(/currency/i);
    const dateInput = screen.getByLabelText(/date/i);

    expect(sideSelect.value).toBe('BUY');
    expect(amountInput.value).toBe('50000');
    expect(currencyInput.value).toBe('USD');
    expect(dateInput.value).toBe(minDate.toISOString().substring(0, 10));

    // Change amount
    fireEvent.change(amountInput, { target: { value: '60000' } });
    expect(mockSetLegs).toHaveBeenCalled();

    // Click request
    fireEvent.click(screen.getByText(/request/i));
    expect(mockHandleQuoteRequest).toHaveBeenCalled();
  });
});
