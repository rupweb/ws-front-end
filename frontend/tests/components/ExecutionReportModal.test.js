import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ExecutionReportModal from '../../src/components/ExecutionReportModal.js';
import {
  getStoredBlotterExecutions
} from '../../src/utils/blotterStorage.js';

describe('ExecutionReportModal', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists a sales execution only once even after rerender', async () => {
    const executionReport = {
      kind: 'sales',
      executedAt: '2026-04-07T10:00:00.000Z',
      dealID: 'SALE-1',
      amount: '1000.00',
      currency: 'USD',
      symbol: 'EURUSD',
      deliveryDate: '20260409',
      secondaryCurrency: 'EUR',
      rate: '1.08234',
      secondaryAmount: '923.92',
      transactionType: '',
      legs: []
    };

    const { rerender } = render(
      <ExecutionReportModal
        show
        message=""
        onClose={jest.fn()}
        executionReport={executionReport}
        handleReset={jest.fn()}
      />
    );

    rerender(
      <ExecutionReportModal
        show
        message=""
        onClose={jest.fn()}
        executionReport={executionReport}
        handleReset={jest.fn()}
      />
    );

    await waitFor(() => expect(getStoredBlotterExecutions()).toHaveLength(1));
    expect(getStoredBlotterExecutions()[0]).toEqual(expect.objectContaining({
      kind: 'sales',
      dealID: 'SALE-1'
    }));
  });

  it('renders trading labels and persists full leg data', async () => {
    const executionReport = {
      kind: 'trading',
      executedAt: '2026-04-07T11:00:00.000Z',
      dealID: 'TRD-1',
      transactionType: 'SWP',
      symbol: 'EURUSD',
      legs: [
        {
          side: 'BUY',
          amount: '1000000.00',
          currency: 'USD',
          valueDate: '20260409',
          price: '1.08234'
        },
        {
          side: 'SELL',
          amount: '1000000.00',
          currency: 'USD',
          valueDate: '20260509',
          price: '1.08310'
        }
      ]
    };

    render(
      <ExecutionReportModal
        show
        message=""
        onClose={jest.fn()}
        executionReport={executionReport}
        handleReset={jest.fn()}
      />
    );

    expect(screen.getByText('Type:')).toBeInTheDocument();
    expect(screen.getByText('Ccy:')).toBeInTheDocument();
    expect(screen.getByText('Legs:')).toBeInTheDocument();
    expect(screen.getByText(/L2 SELL 1000000.00 USD 20260509 @ 1.08310/)).toBeInTheDocument();

    await waitFor(() => expect(getStoredBlotterExecutions()).toHaveLength(1));
    expect(getStoredBlotterExecutions()[0]).toEqual(expect.objectContaining({
      kind: 'trading',
      dealID: 'TRD-1',
      legs: expect.arrayContaining([
        expect.objectContaining({
          side: 'BUY',
          amount: '1000000.00'
        })
      ])
    }));
  });
});
