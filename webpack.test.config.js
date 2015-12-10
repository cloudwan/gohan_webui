var port = 8090;
var hostname = 'localhost';
var webpack = require('webpack');
var BowerWebpackPlugin = require('bower-webpack-plugin');

module.exports = {
 output: {
    path: __dirname + '/test/',
    filename: 'test.build.js',
    sourceMapFilename: '[file].map',
    publicPath: 'http://' + hostname + ':' + port + '/test/index.html'
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
      }
    ],
    postLoaders: [
      {
        test: /\.js$/,
        exclude: /(test|bower_components|node_modules|resources\/js\/vendor)/,
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
    })
  ],
  devtool: 'inline-source-map',
  devServer: {
    host: hostname,
    port: port
  }
};
