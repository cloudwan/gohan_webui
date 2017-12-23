const path = require('path');
const gitSync = require('git-rev-sync');
const process = require('process');
const webpack = require('webpack');
const HappyPack = require('happypack');
const NyanProgressPlugin = require('nyan-progress-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const pkg = require('./package.json');
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
    version: pkg.version
  };
}

const config = {
  context: __dirname,
  entry: {
    polyfill: 'babel-polyfill',
    main: './src/index'
  },
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
        use: 'happypack/loader?id=jsx'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: 'happypack/loader?id=css'
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: 'happypack/loader?id=scss'
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
    new NyanProgressPlugin(),
    new HappyPack({
      id: 'jsx',
      threadPool: happyThreadPool,
      verbose: false,
      loaders: [
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
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
          loader: 'fast-sass-loader',
          options: {
            sourceMap: isDevelopment,
            minimize: !isDevelopment
          }
        }
      ]
    }),
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
      allChunks: false,
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
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => module.context && module.context.indexOf('node_modules') !== -1
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  performance: {
    hints: false
  },
  devtool: 'inline-source-map',
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

if (!isDevelopment) {
  config.plugins.push(
    new UglifyJSPlugin({
      sourceMap: isDevelopment,
      parallel: true,
      uglifyOptions: {
        mangle: {
          toplevel: !isDevelopment
        },
        output: {
          beautify: isDevelopment,
          ecma: 6
        },
        minimize: !isDevelopment,
        compress: {
          sequences: true,
          properties: true,
          dead_code: true, // eslint-disable-line camelcase
          drop_debugger: true, // eslint-disable-line camelcase
          unsafe: true,
          conditionals: true,
          comparisons: true,
          evaluate: true,
          booleans: true,
          loops: true,
          unused: true,
          hoist_funs: true, // eslint-disable-line camelcase
          hoist_vars: false, // eslint-disable-line camelcase
          if_return: true, // eslint-disable-line camelcase
          join_vars: true, // eslint-disable-line camelcase
          cascade: true,
          side_effects: true, // eslint-disable-line camelcase
          warnings: true,
          global_defs: {} // eslint-disable-line camelcase
        }
      }
    })
  );
} else {
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
