import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

test('renders react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Sale/i);
  expect(linkElement).toBeInTheDocument();
});
