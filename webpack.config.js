const process = require('process');
const path = require('path');
const gitSync = require('git-rev-sync');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const pkg = require('./package.json');

const devServerPort = 8080;
const devServerHostname = 'localhost';
const sourcePath = path.join(__dirname, '/src');
const outputPath = path.join(__dirname, '/dist');
const ENV = process.env.NODE_ENV;

const version = () => ({
  hash: gitSync.long(),
  tag: gitSync.tag(),
  version: pkg.version
});

module.exports = {
  context: __dirname,
  entry: [
    'babel-polyfill',
    './src/index'
  ],
  output: {
    path: outputPath,
    filename: '[name].[hash].js',
    sourceMapFilename: '[file].map'
  },
  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        include: [
          __dirname
        ],
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              query: {
                sourceMap: true,
                modules: true
              }
            }
          ]
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        })
      },
      {
        test: /\.(woff|woff2|svg|ttf|eot)([\?]?.*)$/,
        use: {
          loader: 'file-loader',
          query: {
            name: '[name].[ext]'
          }
        }
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      sourcePath
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
      allChunks: true
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/config.json',
        to: 'config.json'
      },
      {
        from: 'locales',
        to: 'locales'
      }
    ]),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body'
    }),
    new webpack.DefinePlugin({
      process: {
        env: {
          ENV: JSON.stringify(ENV),
          NODE_ENV: JSON.stringify(ENV)
        }
      },
      gohanVersion: JSON.stringify(version())
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => module.context && module.context.indexOf('node_modules') !== -1
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    }),
    new webpack.optimize.OccurrenceOrderPlugin()
  ],
  performance: {
    hints: false
  },
  devtool: 'source-map',
  devServer: {
    host: devServerHostname,
    port: devServerPort,
    hot: true,
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: true,
      warnings: true
    },
  }
};
