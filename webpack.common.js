/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { optimize: { CommonsChunkPlugin } } = require('webpack');

module.exports = {
  entry: {
    background: './src/js/background',
    content: './src/js/content',
    popup: './src/js/popup',
    // devTools: './src/js/devTools',
    // options: './src/js/options',
  },
  resolve: {
    modules: [path.join(__dirname, 'src'), 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          'babel-loader',
          {
            loader: 'eslint-loader',
            options: {
              fix: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      // {
      //   test: /\.css$/,
      //   exclude: [
      //     /node_modules/,
      //   ],
      //   loader: ExtractTextPlugin.extract({
      //     fallback: 'style-loader',
      //     use: ['css-loader?modules&localIdentName="[local]__[hash:base64:6]"', 'postcss-loader'],
      //   }),
      // },
    ],
  },
  plugins: [
    // new ExtractTextPlugin({
    //   filename: 'master.css',
    //   allChunks: true,
    // }),
    new CopyWebpackPlugin([
      { from: './src' },
    ], {
      ignore: ['js/**/*'],
    }),
    new CommonsChunkPlugin({
      name: 'commons',
      filename: 'commons.js',
    }),
  ],
};
