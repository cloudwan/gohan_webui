var port = 8081;
var hostname = 'localhost';

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var BowerWebpackPlugin = require('bower-webpack-plugin');

module.exports = {
  context: __dirname,
 output: {
    path: __dirname + '/test/',
    filename: 'test.build.js',
    sourceMapFilename: '[file].map'

  },
  module: {
    loaders: [
      {
        test: /(\.css|\.less)$/,
        loader: 'null-loader',
        exclude: [
          /build/
        ]
      },
      {
        test: /(\.jpg|\.jpeg|\.png|\.gif|\.dtd|\.ttf|\.woff|\.eot|\.dtd|\.svg)$/,
        loader: 'null-loader'
      },
      {
        test: /\.html$/,
        loader: 'underscore-template-loader'
      }
    ],
    postLoaders: [
      {
        test: /\.js$/,
        exclude: /(test|bower_components|node_modules|libs|resources\/js\/vendor)/,
        loader: 'istanbul-instrumenter'
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      _: 'underscore',
      Backbone: 'backbone'
    }),
    new BowerWebpackPlugin({
      modulesDirectories: ['./app/bower_components'],
      manifestFiles: 'bower.json',
      includes: /.*/,
      excludes: [],
      searchResolveModulesDirectories: true
    }),
    new HtmlWebpackPlugin({
      template: './test/index.html',
      inject: 'body'
    }),
  ],
  devtool: 'inline-source-map',
  devServer: {
    host: hostname,
    port: port
  }
};
