// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './css/App.css';
import CurrencyConverter from './components/CurrencyConverter.js';
import Blotter from './components/Blotter.js';
import Onboarding from './components/Onboarding.js';
import { Authenticator } from '@aws-amplify/ui-react';
import CookieConsent from 'react-cookie-consent';
import { WebSocketProvider } from './contexts/WebSocketContext.js';

function App() {
  return (
    <>
      <CookieConsent>
        This website uses cookies
      </CookieConsent>
      <div className="auth-container">
        <Authenticator signUpAttributes={['email']}>
          {({ signOut, user }) => (
            <WebSocketProvider url="ws://localhost:8090/ws">
              {/* <WebSocketProvider url="ws://ec2-13-42-7-2.eu-west-2.compute.amazonaws.com:8081/ws"> */}
              <Router>
                <div className="App">
                  <Header user={user} signOut={signOut} />
                  <div className="content-container">
                    <Routes>
                      <Route path="/" element={<CurrencyConverter />} />
                      <Route path="/blotter" element={<Blotter />} />
                      <Route path="/onboarding" element={<Onboarding />} />
                    </Routes>
                  </div>
                  <Footer />
                </div>
              </Router>
            </WebSocketProvider>
          )}
        </Authenticator>
      </div>
    </>
  );
}

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
