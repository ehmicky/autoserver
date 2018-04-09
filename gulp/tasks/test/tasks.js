'use strict';

const { src, parallel } = require('gulp');
const eslint = require('gulp-eslint');
const jscpd = require('gulp-jscpd');

const FILES = require('../../files');

const { linksCheck } = require('./linkcheck');

const lint = function () {
  return src(FILES.SOURCE)
    .pipe(eslint({
      cache: true,
      ignorePath: '.gitignore',
    }))
    .pipe(eslint.format('codeframe'))
    .pipe(eslint.failAfterError());
};

// eslint-disable-next-line fp/no-mutation
lint.description = 'Lint source files';

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

// eslint-disable-next-line fp/no-mutation
dup.description = 'Check for code duplication';

const links = function () {
  return src(FILES.DOCS)
    .pipe(linksCheck());
};

// eslint-disable-next-line fp/no-mutation
links.description = 'Check for dead links in documentation Markdown files';

const testTask = parallel(lint, dup, links);

// eslint-disable-next-line fp/no-mutation
testTask.description = 'Lint and test the application';

module.exports = {
  test: testTask,
  lint,
  dup,
  links,
};
