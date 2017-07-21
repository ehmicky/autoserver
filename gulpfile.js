'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const jscpd = require('gulp-jscpd');

const { gulpSrc } = require('./gulp');

gulp.task('general_lint', () =>
  gulpSrc('lint')
    .pipe(eslint({
      cache: true,
      ignorePath: '.gitignore',
    }))
    .pipe(eslint.format('codeframe'))
    .pipe(eslint.failAfterError())
);

gulp.task('dup_lint', () =>
  gulpSrc('lint')
    .pipe(jscpd({
      verbose: true,
      blame: true,
      'min-lines': 0,
      'min-tokens': 28,
      'skip-comments': true,
    }))
);

gulp.task('lint', ['general_lint', 'dup_lint']);

gulp.task('test', ['lint']);

gulp.task('default', ['test']);
