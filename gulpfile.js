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
    exclude: [/bootstrap-sass-official\/.*\.js/, /bootstrap\.css/],
    overrides: {
      iCheck: {
        main: [
          './icheck.js',
          './skins/square/blue.css',
          './skins/square/blue.png',
          './skins/square/blue@2x.png'
        ]
      },
      'bootstrap-maxlength': {
        main: './src/bootstrap-maxlength.js'
      }
    }
  }
};

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file)(options);
});

gulp.task('copy-bs-fonts', function(){
  return gulp.src(options.wiredep.directory + '/bootstrap-sass/assets/fonts/bootstrap/*.{eot,svg,ttf,woff,woff2}')
    .pipe(gulp.dest(options.src + '/fonts/'));
});

gulp.task('copy-fa-fonts', function(){
  return gulp.src(options.wiredep.directory + '/font-awesome/fonts/*.{otf,eot,svg,ttf,woff,woff2}')
    .pipe(gulp.dest(options.src + '/fonts/'));
});

gulp.task('copy-project-fonts', gulp.series('copy-bs-fonts', 'copy-fa-fonts'));

gulp.task('copy-icheck-images', function(){
  return gulp.src(options.wiredep.directory + '/iCheck/skins/square/*.png')
    .pipe(gulp.dest(options.dist + '/styles/'));
});

gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('server', gulp.series('copy-project-fonts', 'serve'));

gulp.task('builder', gulp.series('clean', 'copy-project-fonts', 'build'));

gulp.task('vendor_js', function() {
  return gulp.src([
    'src/vendor/*.js'
  ], {
    dot: true
  }).pipe(gulp.dest(options.dist + '/vendor'));
});

gulp.task('default', gulp.series('builder', 'vendor_js', 'copy-icheck-images'));

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


