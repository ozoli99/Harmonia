const Dotenv = require('dotenv-webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // Specify the entry point for your application.
  entry: './src/index.tsx',

  // Output configuration.
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },

  // Enable source maps for debugging.
  devtool: 'source-map',

  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
    host: "0.0.0.0",
    allowedHosts: "all",
    port: 8080,
    open: true,
    client: {
      webSocketURL: {
        hostname: "reimagined-goggles-wgg96677x97c7q6-8080.app.github.dev",
        port: 443,
        protocol: "wss",
      },
    },
  },

  // Resolve these file extensions.
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },

  // Module rules for handling different file types.
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'], // postcss-loader will process your Tailwind directives.
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },

  // Plugins for generating the HTML file.
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
    }),
    new Dotenv(),
  ],

  // Development server configuration.
  devServer: {
    historyApiFallback: true, // For React Router
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 8080,
    open: true,
  },
};
