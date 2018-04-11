'use strict';

const { src, dest, parallel } = require('gulp');
const yamlToJson = require('gulp-yaml');

const FILES = require('../files');
const { getWatchTask } = require('../utils');

const format = function () {
  return src(FILES.FORMAT)
    .pipe(yamlToJson({
      schema: 'JSON_SCHEMA',
      space: 2,
    }))
    .pipe(dest(({ base }) => base));
};

// eslint-disable-next-line fp/no-mutation
format.description = 'Convert YAML files to JSON';

const build = parallel(format);

// eslint-disable-next-line fp/no-mutation
build.description = 'Build the application';

const buildwatch = getWatchTask({ FORMAT: format }, build);

// eslint-disable-next-line fp/no-mutation
buildwatch.description = 'Build the application in watch mode';

module.exports = {
  build,
  buildwatch,
  format,
};
