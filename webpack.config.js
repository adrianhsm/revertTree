const pj = require('path').join;
const fs = require('fs');
const config = {
  entry: {
    'findResponsibility': ['./src/revert.js'],
  },
  output: {
    filename: '[name].js',
    path: pj(__dirname, 'webpacked'),
  },
  resolve: {
    extensions: ['.js', '.json'],
  },
  module: {
    rules: [
      {
      },
      {
        test: /\.yaml$/,
        loader: 'yaml-loader',
      },
    ],
  },
  target: 'node',
  node: {
    __dirname: false,
  },
  //externals: nodeModules,
  plugins: [
  ]
};

module.exports = config;