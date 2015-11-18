var gulp = require('gulp');
var gutil = require('gulp-util');
var compass = require('gulp-compass');
var path = require('path');
var jst = require('gulp-jst');
var template = require('gulp-underscore-template');
var concat = require('gulp-concat');
var jscs = require('gulp-jscs');
var del = require('del');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var BowerWebpackPlugin = require('bower-webpack-plugin');

var webpackConfig = {
  context: __dirname,
  entry: './js/app',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
    sourceMapFilename: '[file].map'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.less$/,
        loader: 'style!css'
      },
      {
        test: /\.(woff|svg|ttf|eot)([\?]?.*)$/,
        loader: 'file-loader?name=[name].[ext]'
      }
    ]
  },
  plugins: [
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
      template: 'index.html',
      inject: 'body'
    })
  ],
  devtool: 'source-map'
};

gulp.task('clean', function (callback) {
  del.sync(['./dist/']);
  callback();
});

gulp.task('copy-config-files', ['clean'], function(callback) {
  gulp.src('./config.json')
    .pipe(gulp.dest('./dist'));
  gulp.src('./schema.json')
    .pipe(gulp.dest('./dist'));
  callback();
});

gulp.task('build-dev', ['copy-config-files', 'compass_gohan', 'jst', 'jscs'], function(callback) {
  webpack(webpackConfig, function(err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }
    gutil.log('[webpack]' + __dirname, stats.toString({
    }));
    callback();
  });
});

gulp.task('build-prod', ['copy-config-files', 'compass_gohan', 'jst', 'jscs'], function(callback) {
  delete webpackConfig.devtool;
  webpackConfig.output.filename = 'bundle.min.js';
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
  webpack(webpackConfig, function(err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }
    gutil.log('[webpack]' + __dirname, stats.toString({
    }));
    callback();
  });
});

gulp.task('dev-server', ['copy-config-files', 'compass_gohan', 'jst', 'jscs'], function(callback) {
  // Start a webpack-dev-server
  var compiler = webpack(webpackConfig);

  new WebpackDevServer(compiler, {
  }).listen(8080, 'localhost', function(err) {
    if (err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }
    gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');
  });
});

gulp.task('jst', function() {
  gulp.src('./templates/*.html')
    .pipe(template())
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('./jst'));
});

gulp.task('jscs', function() {
  return gulp.src('js/**/*.js')
    .pipe(jscs({
      configPath: './.jscsrc',
      fix: false
    }))
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
});

gulp.task('compass_gohan', function() {
  gulp.src('./css/sass/*.scss')
    .pipe(compass({
      css: './css',
      sass: './css/sass',
      image: './img'
    }))
    //.pipe(minifyCSS())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('default', ['build-dev']);
