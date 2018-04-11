'use strict';

const { src, parallel, lastRun } = require('gulp');
const jscpd = require('gulp-jscpd');

const FILES = require('../../files');
const { execCommand, getWatchTask } = require('../../utils');

const { linksCheck } = require('./linkcheck');

// We do not use `gulp-eslint` because it does not support --cache
const lint = function () {
  return execCommand(`eslint ${FILES.SOURCE.join(' ')} --ignore-path .gitignore --fix --cache --format codeframe`);
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
  return src(FILES.DOCS, { since: lastRun(links) })
    .pipe(linksCheck());
};

// eslint-disable-next-line fp/no-mutation
links.description = 'Check for dead links in documentation Markdown files';

const testTask = parallel(lint, dup, links);

// eslint-disable-next-line fp/no-mutation
testTask.description = 'Lint and test the application';

const testwatch = getWatchTask({ SOURCE: [lint, dup], DOCS: links }, testTask);

// eslint-disable-next-line fp/no-mutation
testwatch.description = 'Lint and test the application in watch mode';

module.exports = {
  test: testTask,
  testwatch,
  lint,
  dup,
  links,
};
