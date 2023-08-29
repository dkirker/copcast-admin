'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

var middleware = require('./proxy');

module.exports = function(options) {
  require('./watch.js')(options);
  require('./inject.js')(options);


  function browserSyncInit(baseDir, browser) {
    browser = browser === undefined ? 'default' : browser;

    var routes = null;
    if(baseDir === options.src || (util.isArray(baseDir) && baseDir.indexOf(options.src) !== -1)) {
      routes = {
        '/bower_components': 'bower_components'
      };
    }

    var server = {
      baseDir: baseDir,
      routes: routes
    };

    if(middleware.length > 0) {
      server.middleware = middleware;
    }

    browserSync.instance = browserSync.init({
      port: 3001,
      ui: { port: 3002 },
      startPath: '/',
      server: server,
      browser: browser
    });
  }

  browserSync.use(browserSyncSpa({
    selector: '[ng-app]'// Only needed for angular apps
  }));

  gulp.task('serve_task', function () {
    browserSyncInit([options.tmp + '/serve', options.src]);
  });
  gulp.task('serve', gulp.series(/*'watch',*/ 'serve_task'));

  gulp.task('serve:dist_task', function () {
    browserSyncInit(options.dist);
  });
  gulp.task('serve:dist', gulp.series('build', 'serve:dist_task'));

  gulp.task('serve:e2e_task', function () {
    browserSyncInit([options.tmp + '/serve', options.src], []);
  });
  gulp.task('serve:e2e', gulp.series('inject', 'serve:e2e_task'));

  gulp.task('serve:e2e-dist_task', function () {
    browserSyncInit(options.dist, []);
  });
  gulp.task('serve:e2e-dist', gulp.series('build', 'serve:e2e-dist_task'));
};
