const port = 8080;
const hostname = 'localhost';
var gitSync = require('git-rev-sync');
var process = require('process');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

function version() {
  return {
    hash: gitSync.long(),
    tag: gitSync.tag(),
    version: process.env.npm_package_version
  };
}

module.exports = {
  context: __dirname,
  entry: [
    'babel-polyfill',
    './src/index'
  ],
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.[hash].js',
    sourceMapFilename: '[file].map'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        include: __dirname,
        loader: 'babel-loader'
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
    new ExtractTextPlugin('styles.css'),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body'
    }),
    new CopyWebpackPlugin([
      { from: 'src/config.json', to: '/config.json' }
    ]),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(version())
    })
  ],
  devServer: {
    host: hostname,
    port: port
  }
};
