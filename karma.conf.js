var webpack = require('webpack');

module.exports = function(config) {
  config.set({

    files: [
      './test/index.js'
    ],

    frameworks: ['mocha', 'chai'],

    preprocessors: {
      './test/index.js': ['webpack'],
      './app/js/view/*.js': ['coverage']
    },

    reporters: ['progress', 'spec', 'coverage'],

    coverageReporter: {
      type: 'html',
      dir: './dist/testCoverage/'
    },

    webpack: require('./webpack.test.config'),

    webpackMiddleware: {
      noInfo: true
    },

    plugins: [
      require('karma-webpack'),
      require('karma-mocha'),
      require('karma-chai'),
      require('karma-coverage'),
      require('karma-phantomjs-launcher'),
      require('karma-spec-reporter')
    ],

    browsers: ['PhantomJS']
  });
};
