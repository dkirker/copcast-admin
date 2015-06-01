'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var wrench = require('wrench');
var karma = require('karma').server;

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
