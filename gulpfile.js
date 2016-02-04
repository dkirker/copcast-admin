'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var wrench = require('wrench');
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


gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
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

