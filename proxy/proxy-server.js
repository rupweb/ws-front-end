const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');
const fs = require('fs');
const http = require('http');
const https = require('https');

const app = express();

// Use morgan for logging
app.use(morgan('combined'));

// Proxy for the backend service on EC2 with WebSocket support
app.use(
  '/backend',
  createProxyMiddleware({
    target: 'http://localhost:8081',  // Changed target to port 8081
    changeOrigin: true,
    ws: true, // Add WebSocket support
    pathRewrite: { '^/backend': '' }, // Remove /backend prefix when forwarding to backend
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying request to: ${proxyReq.path}`);
    },
    onError: (err, req, res) => {
      console.error(`Error proxying request: ${err.message}`);
      res.status(500).send('Proxy error');
    },
  })
);

// Proxy for the React app on EC2
app.use(
  '/',
  createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying request to: ${proxyReq.path}`);
    },
    onError: (err, req, res) => {
      console.error(`Error proxying request: ${err.message}`);
      res.status(500).send('Proxy error');
    },
  })
);

const httpPort = 8080;  // Keep the proxy on port 8080
const httpsPort = 8443; // Optional HTTPS port

http.createServer(app).listen(httpPort, '0.0.0.0', () => {
  console.log(`HTTP Proxy server is running on port ${httpPort}`);
});

/*
const httpsOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/fxapi.webstersystems.co.uk/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/fxapi.webstersystems.co.uk/fullchain.pem')
};

https.createServer(httpsOptions, app).listen(httpsPort, '0.0.0.0', () => {
  console.log(`HTTPS Proxy server is running on port ${httpsPort}`);
});
*/
