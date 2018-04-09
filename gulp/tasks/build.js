'use strict';

const { promisify } = require('util');

const { src, dest, watch, series, parallel } = require('gulp');
const yamlToJson = require('gulp-yaml');

const FILES = require('../files');

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

const watchByTypes = function () {
  return Promise.all([
    watchByType({ type: 'FORMAT', task: format }),
  ]);
};

const watchByType = async function ({ type, task }) {
  const watcher = watch(FILES[type], task);
  // Wait for watching to be setup to mark the `watch` task as complete
  await promisify(watcher.on.bind(watcher))('ready');
};

// Runs the task before watching
// Using `ignoreInitial` chokidar option does not work because the task would
// be marked as complete before the initial run.
const watchTask = series(build, watchByTypes);

// eslint-disable-next-line fp/no-mutation
watchTask.description = 'Build the application in watch mode';

module.exports = {
  build,
  watch: watchTask,
  format,
};
