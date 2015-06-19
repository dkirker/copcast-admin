'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var wrench = require('wrench');
var karma = require('karma').server;
var gettext = require('gulp-angular-gettext');

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

gulp.task('tests', function(done) {
  return karma.start({
    configFile: 'karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});


gulp.task('pot', function () {
  return gulp.src(['**/*.html'])
    .pipe(gettext.extract('template.po', {
      // options to pass to angular-gettext-tools...
    }))
    .pipe(gulp.dest('src/po/'));
});

gulp.task('translations', function () {
  return gulp.src('src/po/**/*.po')
    .pipe(gettext.compile({
      // options to pass to angular-gettext-tools..
    }))
    .pipe(gulp.dest('src/translations/'));
});
