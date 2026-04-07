import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Blotter from '../../src/components/Blotter.js';
import {
  BLOTTER_STORAGE_KEY
} from '../../src/utils/blotterStorage.js';

describe('Blotter', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders legacy sales executions in the sales blotter', () => {
    localStorage.setItem('executions', JSON.stringify([
      {
        date: '04/07/2026',
        dealID: 'SALE-1',
        salePrice: '1000.00',
        saleCurrency: 'USD',
        deliveryDate: '20260409',
        currencyIHave: 'EUR',
        fxRate: '1.0823400',
        amountToPay: '923.92'
      }
    ]));

    render(
      <MemoryRouter initialEntries={['/blotter/sales']}>
        <Blotter view="sales" />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Sales Blotter' })).toBeInTheDocument();
    expect(screen.getByText('Sale Price')).toBeInTheDocument();
    expect(screen.getByText('SALE-1')).toBeInTheDocument();
    expect(screen.getByText('1000.00')).toBeInTheDocument();
  });

  it('renders trading executions with one row per deal and all legs in the legs column', () => {
    localStorage.setItem(BLOTTER_STORAGE_KEY, JSON.stringify([
      {
        schemaVersion: 1,
        kind: 'trading',
        executedAt: '2026-04-07T11:00:00.000Z',
        dealID: 'TRD-2',
        transactionType: 'MUL',
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
          },
          {
            side: 'BUY',
            amount: '500000.00',
            currency: 'USD',
            valueDate: '20260609',
            price: '1.08425'
          }
        ]
      },
      {
        schemaVersion: 1,
        kind: 'trading',
        executedAt: '2026-04-07T09:00:00.000Z',
        dealID: 'TRD-1',
        transactionType: 'SWP',
        symbol: 'GBPUSD',
        legs: [
          {
            side: 'BUY',
            amount: '500000.00',
            currency: 'USD',
            valueDate: '20260409',
            price: '1.25100'
          },
          {
            side: 'SELL',
            amount: '500000.00',
            currency: 'USD',
            valueDate: '20260509',
            price: '1.25220'
          }
        ]
      }
    ]));

    render(
      <MemoryRouter initialEntries={['/blotter/trading']}>
        <Blotter view="trading" />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Trading Blotter' })).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Ccy')).toBeInTheDocument();
    expect(screen.getByText('Legs')).toBeInTheDocument();
    expect(screen.getByText('Multileg')).toBeInTheDocument();
    expect(screen.getByText('EURUSD')).toBeInTheDocument();
    expect(screen.getByText(/L1 BUY 1000000.00 USD 20260409 @ 1.08234/)).toBeInTheDocument();
    expect(screen.getByText(/L3 BUY 500000.00 USD 20260609 @ 1.08425/)).toBeInTheDocument();

    const tableBodyRows = within(screen.getAllByRole('rowgroup')[0].nextElementSibling).getAllByRole('row');
    expect(within(tableBodyRows[0]).getByText('TRD-2')).toBeInTheDocument();
  });

  it('shows an empty state when a blotter has no executions', () => {
    render(
      <MemoryRouter initialEntries={['/blotter/trading']}>
        <Blotter view="trading" />
      </MemoryRouter>
    );

    expect(screen.getByText('No trading executions yet.')).toBeInTheDocument();
  });
});
