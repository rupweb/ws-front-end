import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './css/App.css';
import CurrencyConverter from './components/CurrencyConverter';
import Blotter from './components/Blotter';
import Login from './components/Login';
import { Authenticator } from '@aws-amplify/ui-react';

function App() {
  return (
    <Router>
      <div className="App">
        <Authenticator.Provider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/blotter" element={<BlotterPage />} />
          </Routes>
        </Authenticator.Provider>
      </div>
    </Router>
  );
}

const Home = () => (
  <header className="App-header">
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={`${process.env.PUBLIC_URL}/fx.jpg`}
        alt="FX Logo"
        style={{ width: '100px', height: 'auto', marginRight: '10px' }}
      />
    </div>
    <CurrencyConverter />
    <div className="blotter-link">
      <Link to="/blotter" className="small-link">View FX Blotter</Link>
    </div>
    <div className="login-link">
      <Link to="/login" className="small-link">Login</Link>
    </div>
  </header>
);

const BlotterPage = () => (
  <header className="App-header">
    <h1 className="blotter-title">My FX Blotter</h1>
    <Blotter />
    <div className="back-link">
      <Link to="/" className="small-link">Back to Currency Converter</Link>
    </div>
  </header>
);

export default App;
