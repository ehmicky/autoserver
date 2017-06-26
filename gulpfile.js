'use strict';


const gulp = require('gulp');
const eslint = require('gulp-eslint');


const files = {
  'src/**/*.js': { lint: true },
  '*.js': { lint: true },
};
const getFiles = function (type) {
  return Object.entries(files)
    .filter(([, opts]) => opts[type])
    .map(([pattern]) => pattern);
};


gulp.task('lint', () => {
  // TODO: add --ignore-path .gitignore and --cache
  gulp.src(getFiles('lint'))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', ['lint']);

gulp.task('default', ['test']);
