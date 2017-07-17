'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');

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

gulp.task('test', ['lint']);

gulp.task('default', ['test']);
