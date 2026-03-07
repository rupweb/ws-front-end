// App.js

import React, { useState, useEffect, useRef } from 'react';
import { Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
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
                    <Route path="/trade" element={<TradeEntry />} />
                    <Route path="/blotter" element={<Blotter />} />
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

const EMPTY_QUOTE = {
  fxRate: 0,
  secondaryAmount: 0,
  symbol: '',
  quoteRequestID: '',
  quoteID: '',
  clientID: ''
};

const RouteLeaveQuoteCancelGuard = ({ amplifyUsername }) => {
  const location = useLocation();
  const previousPathRef = useRef(location.pathname);
  const { quote, showQuote, setShowQuote, setQuote, sendMessage } = useWebSocket();

  useEffect(() => {
    const previousPath = previousPathRef.current;
    const currentPath = location.pathname;
    const leavingHome = previousPath === '/' && currentPath !== '/';

    if (leavingHome && showQuote && quote?.quoteRequestID && quote?.symbol) {
      prepareQuoteCancel({
        symbol: quote.symbol,
        quoteRequestID: quote.quoteRequestID,
        clientID: quote.clientID || amplifyUsername || 'TEST',
        sendMessage
      });

      setShowQuote(false);
      setQuote(EMPTY_QUOTE);
    }

    previousPathRef.current = currentPath;
  }, [amplifyUsername, location.pathname, quote, sendMessage, setQuote, setShowQuote, showQuote]);

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
        <Link to="/">Home</Link>
        <Link to="/trade">Trade</Link>
        <Link to="/blotter">Blotter</Link>
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
