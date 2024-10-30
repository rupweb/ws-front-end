// App.js

import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import './css/App.css';
import CurrencyConverter from './components/CurrencyConverter.js';
import Blotter from './components/Blotter.js';
import Onboarding from './components/Onboarding.js';
import Login from './components/Login.js';
import { Authenticator } from '@aws-amplify/ui-react';
import CookieConsent from 'react-cookie-consent';
import { WebSocketProvider } from './contexts/WebSocketContext.js';
import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';


function App() {
  const websocketUrl = process.env.REACT_APP_WS_URL;

  const [amplifyUsername, setAmplifyUsername] = useState('');
  const [kycComplete, setKycComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const myFetchUserAttributes = async () => {
      try {
        const session = await fetchAuthSession();
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
                  <div className="content-container">
                  <Routes>
                    <Route
                      path="/"
                      element={
                        amplifyUsername ? (
                          <CurrencyConverter amplifyUsername={amplifyUsername} kycComplete={kycComplete} />
                        ) : (
                          <>Loading...</>
                        )
                      }
                    />
                    <Route path="/blotter" element={<Blotter />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/login" element={<Login />} />
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
