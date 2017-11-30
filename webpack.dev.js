const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  output: {
    path: path.resolve(__dirname, './build/dev'),
    filename: '[name].js',
  },
  devtool: 'inline-source-map',
  watch: true,
});
