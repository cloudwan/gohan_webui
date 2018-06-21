const path = require('path');
const gitSync = require('git-rev-sync');
const process = require('process');
const webpack = require('webpack');
const HappyPack = require('happypack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const happyThreadPool = HappyPack.ThreadPool({size: 4});
const devServerPort = 8080;
const devServerHostname = 'localhost';
const sourcePath = path.join(__dirname, '/src');
const outputPath = path.join(__dirname, '/dist');
const ENV = process.env.NODE_ENV;
const isDevelopment = !ENV || ENV.toLowerCase() !== 'production';

process.traceDeprecation = true; // For better debuging purpose.

function version() {
  return {
    hash: gitSync.long(),
    tag: gitSync.tag(),
    version: process.env.npm_package_version
  };
}

const config = {
  context: __dirname,
  entry: {
    polyfill: 'babel-polyfill',
    main: './src/index',
//    css: './css/main.scss'
  },
  output: {
    path: outputPath,
    filename: '[name].[hash].js',
    sourceMapFilename: '[file].map'
  },
  mode: ENV === 'production' ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        include: [
          __dirname
        ],
        use: 'happypack/loader?id=jsx'
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'happypack/loader?id=css'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'happypack/loader?id=scss'
        ]
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
      'node_modules',
      sourcePath
    ]
  },
  plugins: [
    new HappyPack({
      id: 'jsx',
      threadPool: happyThreadPool,
      verbose: false,
      loaders: [
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          }
        }
      ]
    }),
    new HappyPack({
      id: 'css',
      threadPool: happyThreadPool,
      verbose: false,
      loaders: [
        {
          loader: 'css-loader',
          options: {
            sourceMap: isDevelopment,
            minimize: !isDevelopment,
            localIdentName: isDevelopment ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:4]',
            modules: true
          }
        }
      ]
    }),
    new HappyPack({
      id: 'scss',
      threadPool: happyThreadPool,
      verbose: false,
      loaders: [
        {
          loader: 'css-loader',
          options: {
            sourceMap: isDevelopment,
            minimize: !isDevelopment
          }
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: isDevelopment,
            minimize: !isDevelopment
          }
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name].[hash].css',
      chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body'
    }),
    new CopyWebpackPlugin([
      {
        from: 'locales',
        to: 'locales'
      }
    ]),
    new webpack.DefinePlugin({
      process: {
        env: {
          ENV: JSON.stringify(ENV),
          NODE_ENV: JSON.stringify(ENV)
        }
      },
      gohanVersion: JSON.stringify(version())
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  performance: {
    hints: false
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'all'
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  devtool: ENV === 'production' ? undefined : 'inline-source-map',
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
    }
  }
};

if (isDevelopment) {
  config.plugins.push(
    new CopyWebpackPlugin([
      {
        from: 'src/config.json',
        to: 'config.json'
      }
    ])
  );
}

module.exports = config;
