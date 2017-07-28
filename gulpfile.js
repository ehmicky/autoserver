'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const jscpd = require('gulp-jscpd');

const { gulpSrc } = require('./gulp');

gulp.task('lint', () =>
  gulpSrc('lint')
    .pipe(eslint({
      cache: true,
      ignorePath: '.gitignore',
    }))
    .pipe(eslint.format('codeframe'))
    .pipe(eslint.failAfterError())
);

gulp.task('dup', () =>
  gulpSrc('lint')
    .pipe(jscpd({
      verbose: true,
      blame: true,
      'min-lines': 0,
      'min-tokens': 30,
      'skip-comments': true,
    }))
);

gulp.task('test', ['lint', 'dup']);

gulp.task('default', ['test']);
