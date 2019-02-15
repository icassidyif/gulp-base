var gulp = require('gulp');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
var cleancss = require('gulp-cleancss');
var server = require('gulp-server-livereload');
const changed = require('gulp-changed');
var debug = require('gulp-debug');
var plumberNotifier = require('gulp-plumber-notifier');


gulp.task('imgCopy', function(){
  return new Promise (function(resolve, reject) {
    gulp.src('./app/img/*')
      .pipe(gulp.dest('./dist/img/'));
    resolve();
  });
});

gulp.task('jsBuild', async function(){
    gulp.src('./app/js/*.js')
      .pipe(changed('./dist/js/'))
      .pipe(gulp.dest('./dist/js/'));
});

gulp.task('htmlBuild', async function(){
  gulp.src('./app/*.pug')
  .pipe(changed('./dist/', {extension: '.html'}))
    .pipe(pug({
      pretty :true
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('cssBuild', async function(){
  gulp.src('./app/scss/*.sass')
    .pipe(plumberNotifier())
    .pipe(sass())
    .pipe(autoprefixer({
            browsers: ['last 20 versions'],
            cascade: false
        }))
    .pipe(cleancss({keepBreaks: true}))
    .pipe(gulp.dest('./dist/css/'))
});


gulp.task('webserver', function() {
  gulp.src('./dist/')
    .pipe(server({
      livereload: true,
      directoryListing: false,
      open: false
    }));
});

gulp.task('watcher',  function(){
  gulp.watch('./app/js/*', gulp.series('jsBuild'));
  gulp.watch(['./app/icludes/*.pug', './app/*.pug'], gulp.series('htmlBuild'));
  gulp.watch('./app/scss/*.sass', gulp.series('cssBuild'));
});

gulp.task('default', gulp.parallel('webserver', 'watcher'));