'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const jscpd = require('gulp-jscpd');

const { gulpSrc, gulpWatch, checkLinksTask, convertFormat } = require('./gulp');

gulp.task('lint', () =>
  gulpSrc('lint')
    .pipe(eslint({
      cache: true,
      ignorePath: '.gitignore',
    }))
    .pipe(eslint.format('codeframe'))
    .pipe(eslint.failAfterError()));

gulp.task('dup', () =>
  gulpSrc('lint')
    .pipe(jscpd({
      verbose: true,
      blame: true,
      'min-lines': 0,
      'min-tokens': 30,
      'skip-comments': true,
    })));

gulp.task('links', checkLinksTask);

gulp.task('format', () =>
  gulpSrc('format')
    .pipe(convertFormat())
    .pipe(gulp.dest('./src/')));

gulp.task('watch', () =>
  gulpWatch('format')
    .pipe(convertFormat())
    .pipe(gulp.dest('./src/')));

gulp.task('test', ['lint', 'dup', 'links']);

gulp.task('build', ['format']);

gulp.task('default', ['build']);
