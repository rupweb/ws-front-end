import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../src/App';

// Mock the Authenticator component from AWS Amplify
jest.mock('@aws-amplify/ui-react', () => ({
  Authenticator: ({ children }) => children({ signOut: jest.fn(), user: { username: 'testUser' } })
}));

// Mock the WebSocketProvider
jest.mock('../src/handlers/WebSocketContext', () => ({
  WebSocketProvider: ({ children }) => <div>{children}</div>,
  useWebSocket: jest.fn(() => ({
    sendMessage: jest.fn()
  }))
}));

// Mock Polyglot
jest.mock('Polyglot', () => ({
  import: jest.fn(() => ({
    someJavaMethod: jest.fn()
  }))
}));

test('renders the app with header and footer', () => {
  render(
    <App />
  );

  // Check if the CookieConsent component is rendered
  expect(screen.getByText(/This website uses cookies/i)).toBeInTheDocument();

  // Check if the Header contains the logo
  const logo = screen.getByAltText('FX Logo');
  expect(logo).toBeInTheDocument();

  // Check if the Home link is present
  const homeLink = screen.getByText(/Home/i);
  expect(homeLink).toBeInTheDocument();

  // Check if the Blotter link is present
  const blotterLink = screen.getByText(/Blotter/i);
  expect(blotterLink).toBeInTheDocument();

  // Check if the Sign Out button is present
  const signOutButton = screen.getByText(/Sign Out/i);
  expect(signOutButton).toBeInTheDocument();

  // Check if the footer is rendered
  const footer = screen.getByRole('contentinfo');
  expect(footer).toBeInTheDocument();
});
