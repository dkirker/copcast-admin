// Karma configuration
// Generated on Tue May 19 2015 15:02:17 GMT+0100 (WEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: [ 'jasmine', 'browserify'],

    // list of files / patterns to load in the browser
    files: [
      'http://maps.googleapis.com/maps/api/js?sensor=false&language=en',
      // bower:js
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-gettext/dist/angular-gettext.js',
      'bower_components/angular-http-auth/src/http-auth-interceptor.js',
      'bower_components/angular-notify/dist/angular-notify.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-ui-utils/ui-utils.js',
      'bower_components/angular-ui-map/ui-map.js',
      'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
      'bower_components/bootstrap-select/dist/js/bootstrap-select.js',
      'bower_components/event-signal/dist/event-signal.min.js',
      'bower_components/google-map-infobubble/src/infobubble.js',
      'bower_components/moment/moment.js',
      'bower_components/ng-file-upload/ng-file-upload.js',
      'bower_components/ng-file-upload-shim/ng-file-upload-shim.js',
      'bower_components/angularUtils-pagination/dirPagination.js',
      // endbower
      'src/app/**/*.js',
      'src/app/views/**/*.html',
      'src/test/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*.html': ['ng-html2js'],
      'src/**/*.js': ['browserify']
    },

    browserify: {
      debug: true,
      transform: [ 'brfs' ]
    },
    ngHtml2JsPreprocessor: {
      // strip this from the file path
      stripPrefix: 'src/',
      // prepend this to the


      // setting this option will create only a single module that contains templates
      // from all the files, so you can load them all with module('foo')
      moduleName: 'templatesForTest'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress', 'spec'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
