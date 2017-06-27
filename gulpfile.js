'use strict';


const gulp = require('gulp');
const eslint = require('gulp-eslint');

const { gulpSrc } = require('./gulp');


gulp.task('lint', () => {
  return gulpSrc('lint')
    .pipe(eslint({
      cache: true,
      ignorePath: '.gitignore',
      // fix: true,
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


gulp.task('test', ['lint']);

gulp.task('default', ['test']);
