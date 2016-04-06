var port = 8080;
var hostname = 'localhost';
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var BowerWebpackPlugin = require('bower-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: [
    'babel-polyfill',
    './app/js/app'
  ],
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
    sourceMapFilename: '[file].map'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'app')
        ],
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: ['es2015'],
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap')
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!sass?sourceMap')
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!less?sourceMap')
      },
      {
        test: /\.(woff|svg|ttf|eot)([\?]?.*)$/,
        loader: 'file-loader?name=[name].[ext]'
      },
      {
        test: /\.html$/,
        loader: 'underscore-template-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
            'file?hash=sha512&digest=hex&name=[hash].[ext]',
            'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new ExtractTextPlugin('styles.css'),
    new BowerWebpackPlugin({
      modulesDirectories: ['bower_components'],
      manifestFiles: [
        'bower.json',
        '.bower.json',
      ],
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
