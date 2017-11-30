const path = require('path');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  output: {
    path: path.resolve(__dirname, './build/prod'),
    filename: '[name].js',
  },
  devtool: 'source-map',
  plugins: [
    new UglifyJSPlugin(),
  ],
});
