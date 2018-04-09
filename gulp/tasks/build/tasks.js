'use strict';

const { src, dest, watch, parallel } = require('gulp');

const FILES = require('../../files');

const { convertFormat } = require('./format');

const format = function () {
  return src(FILES.FORMAT)
    .pipe(convertFormat())
    .pipe(dest('./src/'));
};

// eslint-disable-next-line fp/no-mutation
format.description = 'Convert YAML files to JSON';

const build = parallel(format);

// eslint-disable-next-line fp/no-mutation
build.description = 'Build the application';

const watchTask = function () {
  watch(FILES.FORMAT, format);
};

// eslint-disable-next-line fp/no-mutation
watchTask.description = 'Build the application in watch mode';

module.exports = {
  build,
  watch: watchTask,
  format,
};
