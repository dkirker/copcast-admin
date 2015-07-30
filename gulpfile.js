'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var wrench = require('wrench');
//var karma = require('gulp-karma');
var gettext = require('gulp-angular-gettext');
var Server = require('karma').Server;

var options = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e',
  errorHandler: function(title) {
    return function(err) {
      gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
      this.emit('end');
    };
  },
  wiredep: {
    directory: 'bower_components',
    exclude: [/bootstrap-sass-official\/.*\.js/, /bootstrap\.css/]
  }
};

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file)(options);
});

var testFiles = [
  'http://maps.googleapis.com/maps/api/js?sensor=false&language=en',
  // bower:js
  'bower_components/jquery/dist/jquery.js',
  'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
  'bower_components/bootstrap-select/dist/js/bootstrap-select.js',
  'bower_components/angular/angular.js',
  'bower_components/angular-animate/angular-animate.js',
  'bower_components/angular-cookies/angular-cookies.js',
  'bower_components/angular-touch/angular-touch.js',
  'bower_components/angular-sanitize/angular-sanitize.js',
  'bower_components/angular-resource/angular-resource.js',
  'bower_components/angular-route/angular-route.js',
  'bower_components/angular-mocks/angular-mocks.js',
  'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
  'bower_components/angular-ui-utils/ui-utils.js',
  'bower_components/angular-ui-map/ui-map.js',
  'bower_components/angular-http-auth/src/http-auth-interceptor.js',
  'bower_components/ng-file-upload/ng-file-upload.js',
  'bower_components/ng-file-upload-shim/ng-file-upload-shim.js',
  'bower_components/angular-notify/dist/angular-notify.js',
  'bower_components/moment/moment.js',
  'bower_components/angular-gettext/dist/angular-gettext.js',
  // endbower
  'src/app/**/*.js',
  'src/app/views/**/*.html',
  'src/test/**/*.js'
];

gulp.task('test', function (done) {
  new Server({
    configFile:  'karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});


//gulp.task('pot', function () {
//  return gulp.src(['**/*.html'])
//    .pipe(gettext.extract('template.po', {
//      // options to pass to angular-gettext-tools...
//    }))
//    .pipe(gulp.dest('src/po/'));
//});

gulp.task('translations', function () {
  return gulp.src('src/po/**/*.po')
    .pipe(gettext.compile({
      // options to pass to angular-gettext-tools..
    }))
    .pipe(gulp.dest('src/app/translations/'));
});

gulp.task('pot', function () {
  return gulp.src(['src/**/*.html', 'src/**/*.js'])
    .pipe(gettext.extract('template.pot', {
      // options to pass to angular-gettext-tools...
    }))
    .pipe(gulp.dest('src/po/'));
});
