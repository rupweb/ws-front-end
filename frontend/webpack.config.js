const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
const env = dotenv.config().parsed;

// Create an object for the DefinePlugin
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = {
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "http": require.resolve("stream-http"),
      "buffer": require.resolve("buffer"),
      "url": require.resolve("url"),
      "os": require.resolve("os-browserify/browser"),
      "fs": false,
      "child_process": false
    },
    extensions: ['.js', '.jsx', '.mjs'] // Add .mjs to the extensions
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    }),
    new webpack.DefinePlugin(envKeys)
  ],
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx)$/, // Add mjs and jsx to the test pattern
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/, // Add rule for CSS files
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  entry: './src/index.js', // Ensure this matches your entry point
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  experiments: {
    topLevelAwait: true // Optional: if you're using top-level await
  }
};
