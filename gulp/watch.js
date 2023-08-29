'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

module.exports = function(options) {
  require('./inject.js')(options);

  gulp.task('watch_task', function () {

    gulp.watch([options.src + '/*.html', 'bower.json'], gulp.series('inject'));

    gulp.watch([
      options.src + '/app/**/*.css',
      options.src + '/app/**/*.scss'
    ], function(event) {
      if(isOnlyChange(event)) {
        //gulp.start('styles');
        gulp.series(gulp.task('styles'))();
      } else {
        //gulp.start('inject');
        gulp.series(gulp.task('inject'))();
      }
    });

    gulp.watch(options.src + '/app/**/*.js', function(event) {
      if(isOnlyChange(event)) {
        //gulp.start('scripts');
        gulp.series(gulp.task('scripts'))();
      } else {
        //gulp.start('inject');
        gulp.series(gulp.task('inject'))();
      }
    });

    gulp.watch(options.src + '/app/**/*.html', function(event) {
      browserSync.reload(event.path);
    });
  });
  gulp.task('watch', gulp.series('inject', 'watch_task'));
};
