var port = 8080;
var hostname = 'localhost';

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var BowerWebpackPlugin = require('bower-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: './app/js/app',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
    sourceMapFilename: '[file].map'
  },
  module: {
    preLoaders: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'jscs-loader'
    }],
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css?sourceMap')
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css?sourceMap', 'sass?sourceMap']
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('css?sourceMap!less?sourceMap')
      },
      {
        test: /\.(woff|svg|ttf|eot)([\?]?.*)$/,
        loader: 'file-loader?name=[name].[ext]'
      },
      {
        test: /\.html$/,
        loader: 'underscore-template-loader'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new BowerWebpackPlugin({
      modulesDirectories: ['bower_components'],
      manifestFiles: 'bower.json',
      includes: /.*/,
      excludes: [],
      searchResolveModulesDirectories: true
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      _: 'underscore',
      Backbone: 'backbone'
    }),
    new HtmlWebpackPlugin({
      template: './app/index.html',
      inject: 'body'
    }),
    new CopyWebpackPlugin([
      { from: 'app/config.json', to: '/config.json' }
    ])
  ],
  devServer: {
    host: hostname,
    port: port
  }
};
