// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

let path = require('path');

module.exports = function(config) {
  let configuration = {
    basePath: path.join(__dirname, '..'),

    logLevel: config.LOG_INFO,

    browserConsoleLogOptions: {terminal: true, level: ''},

    frameworks: ['jasmine', '@angular/cli'],

    plugins: [
      require('@angular/cli/plugins/karma'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-jasmine'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
    ],

    browserNoActivityTimeout: 5 * 60 * 1000,  // 5 minutes.

    reporters: ['progress', 'kjhtml'],

    coverageIstanbulReporter: {
      dir: path.join(__dirname, '..', 'coverage'),
      reports: ['html', 'lcovonly'],
      'report-config': {
        html: {subdir: 'html'},
      },
      fixWebpackSourcePaths: true
    },

    client: {
      clearContext: false  // leave Jasmine Spec Runner output visible in browser
    },

    angularCli: {environment: 'dev'},

    colors: true,
    autoWatch: true,
    port: 9876,
    browsers: ['Chrome'],
    singleRun: false
  };

  // Use custom browser configuration when running on Travis CI.
  if (!!process.env.TRAVIS) {
    configuration.browsers = ['ChromeHeadless', 'FirefoxHeadless'];
    configuration.customLaunchers = {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--disable-gpu',
          '--headless',
          '--no-sandbox',
          '--remote-debugging-port=9222',
        ],
      },
      FirefoxHeadless: {
        base: 'Firefox',
        flags: ['-headless'],
      },
    };
  }

  config.set(configuration);
};
