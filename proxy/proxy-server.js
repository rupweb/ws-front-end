const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');

const app = express();

// Use morgan for logging
app.use(morgan('combined'));

// Proxy for the main site
app.use(
  '/',
  createProxyMiddleware({
    target: 'http://d32psyrastjep.cloudfront.net',
    changeOrigin: true,
    pathRewrite: {
      '^/fxapi': '', // remove /fxapi from the path
      '^/backend': '', // remove /backend from the path
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying request to: ${proxyReq.path}`);
    },
    onError: (err, req, res) => {
      console.error(`Error proxying request: ${err.message}`);
    },
  })
);

// Proxy for the React app on EC2
app.use(
  '/fxapi',
  createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
    pathRewrite: {
      '^/fxapi': '', // remove /fxapi from the path
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying request to: ${proxyReq.path}`);
    },
    onError: (err, req, res) => {
      console.error(`Error proxying request: ${err.message}`);
    },
  })
);

// Proxy for the backend service on EC2
app.use(
  '/backend',
  createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying request to: ${proxyReq.path}`);
    },
    onError: (err, req, res) => {
      console.error(`Error proxying request: ${err.message}`);
    },
  })
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
