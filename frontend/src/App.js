// App.js

import React, { useState, useEffect, useRef } from 'react';
import { Route, Routes, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import './css/App.css';
import CurrencyConverter from './components/CurrencyConverter.js';
import TradeEntry from './components/TradeEntry.js';
import Blotter from './components/Blotter.js';
import Onboarding from './components/Onboarding.js';
import { Authenticator } from '@aws-amplify/ui-react';
import CookieConsent from 'react-cookie-consent';
import { WebSocketProvider, useWebSocket } from './contexts/WebSocketContext.js';
import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
import prepareQuoteCancel from './handlers/handleQuoteCancel.js';
import prepareQuoteCancelV2 from './handlers/handleQuoteCancelV2.js';
import { EMPTY_SALES_QUOTE, EMPTY_TRADING_QUOTE } from './utils/trading.js';

function App() {
  const websocketUrl = process.env.REACT_APP_WS_URL;

  const [amplifyUsername, setAmplifyUsername] = useState('');
  const [kycComplete, setKycComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const myFetchUserAttributes = async () => {
      try {
        const session = await fetchAuthSession();
        if (!session || !session.tokens || !session.tokens.idToken) {
          console.warn('No session or ID token found');
          navigate('/login');
          return;
        }

        const idToken = session.tokens.idToken;
        const username = idToken.payload['cognito:username'];
        setAmplifyUsername(username);

        const attributes = await fetchUserAttributes();
        console.log('Fetched Attributes:', attributes);
        setKycComplete(attributes['custom:kycComplete'] === 'true');
  
      } catch (error) {
        console.log('Error fetching user attributes:', error);
        navigate('/login');  // Redirect to login if there’s an error
      }
    };
  
    myFetchUserAttributes();
  }, [navigate]);

  return (
    <>
      <CookieConsent>
        This website uses cookies
      </CookieConsent>
      <div className="auth-container">
        <Authenticator signUpAttributes={['email']}>
          {({ signOut, user }) => (
            <WebSocketProvider url={websocketUrl}>
                <div className="App">
                  <Header user={user} signOut={signOut} />
                  <RouteLeaveQuoteCancelGuard amplifyUsername={amplifyUsername} />
                  <div className="content-container">
                  <Routes>
                    <Route path="/" element={<CurrencyConverter amplifyUsername={amplifyUsername} kycComplete={kycComplete} />} />
                    <Route path="/trade" element={<TradeEntry amplifyUsername={amplifyUsername} />} />
                    <Route path="/blotter" element={<Navigate to="/blotter/sales" replace />} />
                    <Route path="/blotter/sales" element={<Blotter view="sales" />} />
                    <Route path="/blotter/trading" element={<Blotter view="trading" />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                  </Routes>
                  </div>
                  <Footer />
                </div>
            </WebSocketProvider>
          )}
        </Authenticator>
        </div>
    </>
  );
}

const RouteLeaveQuoteCancelGuard = ({ amplifyUsername }) => {
  const location = useLocation();
  const previousPathRef = useRef(location.pathname);
  const {
    salesQuote,
    showSalesQuote,
    setShowSalesQuote,
    setSalesQuote,
    tradingQuote,
    showTradingQuote,
    setShowTradingQuote,
    setTradingQuote,
    sendMessage
  } = useWebSocket();

  useEffect(() => {
    const previousPath = previousPathRef.current;
    const currentPath = location.pathname;
    const leavingHome = previousPath === '/' && currentPath !== '/';
    const leavingTrading = previousPath === '/trade' && currentPath !== '/trade';

    if (leavingHome && showSalesQuote && salesQuote?.quoteRequestID && salesQuote?.symbol) {
      prepareQuoteCancel({
        symbol: salesQuote.symbol,
        quoteRequestID: salesQuote.quoteRequestID,
        clientID: salesQuote.clientID || amplifyUsername || 'TEST',
        sendMessage
      });

      setShowSalesQuote(false);
      setSalesQuote(EMPTY_SALES_QUOTE);
    }

    if (leavingTrading && showTradingQuote && tradingQuote?.quoteRequestID && tradingQuote?.symbol) {
      prepareQuoteCancelV2({
        transactionType: tradingQuote.transactionType,
        symbol: tradingQuote.symbol,
        quoteRequestID: tradingQuote.quoteRequestID,
        clientID: tradingQuote.clientID || amplifyUsername || 'TEST',
        sendMessage
      });

      setShowTradingQuote(false);
      setTradingQuote(EMPTY_TRADING_QUOTE);
    }

    previousPathRef.current = currentPath;
  }, [
    amplifyUsername,
    location.pathname,
    salesQuote,
    sendMessage,
    setSalesQuote,
    setShowSalesQuote,
    setShowTradingQuote,
    setTradingQuote,
    showSalesQuote,
    showTradingQuote,
    tradingQuote
  ]);

  return null;
};

const Header = ({ user, signOut }) => (
  <header className="App-header">
    <div className="nav-container">
      <img
        src={`${process.env.PUBLIC_URL}/fx.jpg`}
        alt="FX Logo"
        className="nav-logo"
      />
      <nav className="nav-links">
        <Link to="/">Sales</Link>
        <Link to="/trade">Trading</Link>
        <Link to="/blotter/sales">Blotter</Link>
        {user && <Link to="/onboarding">Account</Link>}
        {user && <button className="sign-out-button" onClick={signOut}>Sign Out</button>}
      </nav>
    </div>
  </header>
);

const Footer = () => (
  <footer className="App-footer">
    <div className="footer-content">
    </div>
  </footer>
);

export default App;
