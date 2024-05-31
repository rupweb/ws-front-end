// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './css/App.css';
import CurrencyConverter from './components/CurrencyConverter';
import Blotter from './components/Blotter';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
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
              </header>
            }
          />
          <Route
            path="/blotter"
            element={
              <header className="App-header">
                <h1 className="blotter-title">My FX Blotter</h1>
                <Blotter />
                <div className="back-link">
                  <Link to="/" className="small-link">Back to Currency Converter</Link>
                </div>
              </header>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

