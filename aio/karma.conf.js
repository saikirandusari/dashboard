// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

let path = require('path');

module.exports = function (config) {
  let configuration = {
    basePath: path.join(__dirname, '..'),

    logLevel: config.LOG_INFO,

    browserConsoleLogOptions: {terminal: true, level: ''},

    frameworks: ['jasmine', '@angular/cli'],

    plugins: [
      require('@angular/cli/plugins/karma'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-jasmine'),
      require('karma-jasmine-html-reporter'),
    ],

    browserNoActivityTimeout: 5 * 60 * 1000,  // 5 minutes.

    reporters: ['progress', 'kjhtml', 'coverage'],

    coverageReporter: {
      dir: path.join(__dirname, '..', 'coverage'),
      reporters: [
        {type: 'html', subdir: 'html'},
        {type: 'lcovonly', subdir: 'lcov'},
      ],
    },

    coverageIstanbulReporter: {reports: ['html', 'lcovonly'], fixWebpackSourcePaths: true},

    client: {
      clearContext: false  // leave Jasmine Spec Runner output visible in browser
    },

    angularCli: {environment: 'dev'},

    colors: true,

    autoWatch: true,

    port: 9876,
    browsers: ['ChromeHeadless'],
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--disable-gpu',
          '--headless',
          '--no-sandbox',
          '--remote-debugging-port=9222',
        ],
      },
    },
    singleRun: false
  };

  // Use custom browser configuration when running on Travis CI.
  if (!!process.env.TRAVIS) {
    config.reporters.push('saucelabs');

    let testName;
    if (process.env.TRAVIS) {
      testName = `Karma tests ${process.env.TRAVIS_REPO_SLUG}, build ` +
        `${process.env.TRAVIS_BUILD_NUMBER}, job ${process.env.TRAVIS_JOB_NUMBER}`;
      if (process.env.TRAVIS_PULL_REQUEST !== 'false') {
        testName += `, PR: https://github.com/${process.env.TRAVIS_REPO_SLUG}/pull/` +
          `${process.env.TRAVIS_PULL_REQUEST}, job ${process.env.TRAVIS_JOB_NUMBER}`;
      }
    } else {
      testName = 'Local karma tests';
    }

    config.sauceLabs = {
      testName: testName,
      connectOptions: {port: 5757, logfile: 'sauce_connect.log'},
      public: 'public',
    },
      config.customLaunchers = {
        sl_firefox: {base: 'SauceLabs', browserName: 'firefox'},
        sl_ie: {base: 'SauceLabs', browserName: 'internet explorer'},
        // Chrome must be last to compute coverage correctly.
        sl_chrome: {base: 'SauceLabs', browserName: 'chrome'},
      };
    config.browsers = Object.keys(config.customLaunchers);

    // Set large capture timeout to prevent timeouts when executing on saucelabs.
    config.captureTimeout = 5 * 60 * 1000;  // 5 minutes.

    // Limit concurrency to not exhaust saucelabs resources for the CI user.
    config.concurrency = 1;
  }

  config.set(configuration);
};
