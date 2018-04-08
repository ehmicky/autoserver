'use strict';

// TODO:
//  - check npm scripts and README.md
//  - check built files and .gitignore
//  - check for ENOSPC problem

const { src, dest, watch, parallel, series } = require('gulp');
const eslint = require('gulp-eslint');
const jscpd = require('gulp-jscpd');

const { FILES, linksCheck, convertFormat } = require('./gulp');

const lint = function () {
  return src(FILES.SOURCE)
    .pipe(eslint({
      cache: true,
      ignorePath: '.gitignore',
    }))
    .pipe(eslint.format('codeframe'))
    .pipe(eslint.failAfterError());
};

const dup = function () {
  return src(FILES.SOURCE)
    .pipe(jscpd({
      verbose: true,
      blame: true,
      'min-lines': 0,
      'min-tokens': 30,
      'skip-comments': true,
    }));
};

const links = function () {
  return src(FILES.DOCS)
    .pipe(linksCheck());
};

const format = function () {
  return src(FILES.FORMAT)
    .pipe(convertFormat())
    .pipe(dest('./src/'));
};

const testTask = parallel(lint, dup, links);

const build = parallel(format);

const watchTask = function () {
  watch(FILES.FORMAT, format);
};

const defaultTask = series(testTask, watchTask);

// Lists of descriptions shown with `gulp --tasks`
/* eslint-disable fp/no-mutation */
defaultTask.description = 'Test the application, then build it in watch mode';
watchTask.description = 'Watch for files and trigger builds';
build.description = 'Build the application';
testTask.description = 'Test the application';
format.description = 'Convert YAML files to JSON';
lint.description = 'Lint source files using ESLint';
dup.description = 'Check for code duplication using jscpd';
links.description = 'Check for dead links in documentation Markdown files';
/* eslint-enable fp/no-mutation */

module.exports = {
  default: defaultTask,
  watch: watchTask,
  build,
  test: testTask,
  format,
  lint,
  dup,
  links,
};
