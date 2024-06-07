import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './css/App.css';
import CurrencyConverter from './components/CurrencyConverter';
import Blotter from './components/Blotter';
import { Authenticator } from '@aws-amplify/ui-react';
import CookieConsent from "react-cookie-consent";

function App() {
  return (
    <>
      <CookieConsent>
        This website uses cookies
      </CookieConsent>
      <div className="auth-container">
        <Authenticator signUpAttributes={['email']}>
          {({ signOut, user }) => (
            <Router>
              <div className="App">
                <Header user={user} signOut={signOut} />
                <div className="content-container">
                <Routes>
                    <Route path="/" element={<CurrencyConverter />} />
                    <Route path="/blotter" element={<BlotterPage />} />
                  </Routes>
                </div>
                <Footer />
              </div>
            </Router>
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
        {user && <Link to="/account">Account</Link>}
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

const BlotterPage = () => (
  <div className="App-content">
    <h1 className="blotter-title">My FX Blotter</h1>
    <Blotter />
    <div className="back-link">
      <Link to="/" className="small-link">Back to Currency Converter</Link>
    </div>
  </div>
);

export default App;
