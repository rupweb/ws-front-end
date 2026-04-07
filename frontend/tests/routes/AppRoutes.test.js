import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../src/App.js';

jest.mock('@aws-amplify/ui-react', () => ({
  Authenticator: ({ children }) => children({ signOut: jest.fn(), user: { username: 'testUser' } })
}));

jest.mock('aws-amplify/auth', () => ({
  fetchAuthSession: jest.fn(async () => ({
    tokens: {
      idToken: {
        payload: {
          'cognito:username': 'testUser'
        }
      }
    }
  })),
  fetchUserAttributes: jest.fn(async () => ({
    'custom:kycComplete': 'true'
  }))
}));

jest.mock('../../src/contexts/WebSocketContext.js', () => ({
  WebSocketProvider: ({ children }) => <div>{children}</div>,
  useWebSocket: jest.fn(() => ({
    quote: null,
    showQuote: false,
    setShowQuote: jest.fn(),
    setQuote: jest.fn(),
    sendMessage: jest.fn()
  }))
}));

jest.mock('../../src/components/CurrencyConverter.js', () => () => <div>Sales Page</div>);
jest.mock('../../src/components/TradeEntry.js', () => () => <div>Trading Page</div>);
jest.mock('../../src/components/Onboarding.js', () => () => <div>Account Page</div>);
jest.mock('../../src/components/Blotter.js', () => ({ view }) => <div>{view === 'trading' ? 'Trading Blotter Route' : 'Sales Blotter Route'}</div>);

describe('App blotter routes', () => {
  it('redirects /blotter to /blotter/sales', async () => {
    render(
      <MemoryRouter initialEntries={['/blotter']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Sales Blotter Route')).toBeInTheDocument());
  });

  it('renders the trading blotter route at /blotter/trading', async () => {
    render(
      <MemoryRouter initialEntries={['/blotter/trading']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Trading Blotter Route')).toBeInTheDocument());
  });
});
