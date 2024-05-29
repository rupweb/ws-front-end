const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

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
  })
);

// Proxy for the backend service on EC2
app.use(
  '/backend',
  createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
  })
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
