var gulp = require('gulp');
var compass = require('gulp-compass');
var path = require('path');
var minifyCSS = require('gulp-minify-css');
var browserSync = require('browser-sync');
var jst = require('gulp-jst');
var template = require('gulp-template-compile');
var concat = require('gulp-concat');
var reload = browserSync.reload;

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: './'
    }
  });
});

gulp.task('bs-reload', function() {
  browserSync.reload();
});

gulp.task('jst', function() {
  gulp.src('./templates/*.html')
    .pipe(template())
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('./jst'));
});

gulp.task('compass_gohan', function() {
  gulp.src('./css/sass/*.scss')
    .pipe(compass({
      css: './css',
      sass: './css/sass',
      image: './img'
    }))
    //.pipe(minifyCSS())
    //.pipe(gulp.dest('./css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('scripts', function() {
  return gulp.src(['./js/*.js', './js/*/*.js', './js/views/schema/*.js'])
    .pipe(concat('gohan.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('vendor', function() {
  return gulp.src([
    "bower_components/jquery/dist/jquery.min.js",
    "bower_components/jquery.cookie/jquery.cookie.js",
    "bower_components/bootstrap/dist/js/bootstrap.min.js",
    "bower_components/underscore/underscore-min.js",
    "bower_components/backbone/backbone.js",
    "bower_components/js-yaml/dist/js-yaml.min.js",
    "bower_components/z-schema/dist/ZSchema-browser-min.js",
    "bower_components/jquery-ui/ui/core.js",
    "bower_components/jquery-ui/ui/widget.js",
    "bower_components/jquery-ui/ui/mouse.js",
    "bower_components/jquery-ui/ui/sortable.js",
    "bower_components/jsonform/deps/opt/ace/ace.js",
    "bower_components/jsonform/lib/jsonform.js",
    "bower_components/jsonform/lib/jsonform.js",
    "bower_components/jsonform/lib/jsonform.js",
    "bower_components/bootstrap-dialog/dist/js/bootstrap-dialog.min.js",
    "bower_components/bootstrap-material-design/dist/js/material.js",
    "bower_components/bootstrap-material-design/dist/js/ripples.js"
    ])
    .pipe(concat('gohan_vendor.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build', ['jst', 'scripts', 'vendor', 'compass_gohan']);

gulp.task('default', ['browser-sync'], function() {
  gulp.watch([
    './js/*.js',
    './templates/*.html',
    './js/*/*.js',
    './js/views/schema/*.js'
  ], ['jst', 'scripts', 'vendor', 'bs-reload']);
  gulp.watch(['./css/sass/*.scss'], ['compass_gohan']);
});
