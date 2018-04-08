'use strict';

// TODO:
//  - check watch task
//  - add code comments
//  - split into several files
//  - Growl?
//  - check npm scripts and README.md
//  - check built files and .gitignore

const { src, dest, watch, parallel } = require('gulp');
const eslint = require('gulp-eslint');
const jscpd = require('gulp-jscpd');

const { linksCheck, convertFormat } = require('./gulp');

const FILES = {
  SOURCE: [
    '*.js',
    '*.md',
    'bin/*',
    'src/**/*.js',
    'gulp/**/*.js',
    'examples/**/*.js',
    'docs/**/*.md',
  ],
  FORMAT: [
    'src/**/*.yml',
  ],
  DOCS: [
    '*.md',
    'docs/**/*.md',
  ],
};

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
  watch(FILES.SOURCE, build);
  watch(FILES.FORMAT, format);
};

/* eslint-disable fp/no-mutation */
lint.description = 'Lint source files using ESLint';
dup.description = 'Check for code duplication using jscpd';
links.description = 'Check for dead links in documentation Markdown files';
format.description = 'Convert YAML files to JSON';
testTask.description = 'Test the application';
build.description = 'Build the application';
watchTask.description = 'Watch for files and trigger builds';
/* eslint-enable fp/no-mutation */

module.exports = {
  lint,
  dup,
  links,
  format,
  test: testTask,
  build,
  default: build,
  watch: watchTask,
};
