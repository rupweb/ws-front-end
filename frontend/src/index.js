// index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals.js';

import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports.js';

Amplify.configure(awsconfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);

reportWebVitals();
