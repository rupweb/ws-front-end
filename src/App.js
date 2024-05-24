import React from 'react';
import './App.css';
import CurrencyConverter from './CurrencyConverter';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={`${process.env.PUBLIC_URL}/dotmed.jpg`} alt="Dotmed Logo" style={{ width: '100px', height: 'auto', marginRight: '10px' }} />
          <h1>FX</h1>
        </div>
        <CurrencyConverter />
      </header>
    </div>
  );
}

export default App;

