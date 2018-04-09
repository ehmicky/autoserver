'use strict';

const { series } = require('gulp');

const { dev } = require('./start');
const { watch } = require('./build');

const defaultTask = series(watch, dev);

// eslint-disable-next-line fp/no-mutation
defaultTask.description = 'Build the application and start an example server in watch mode';

module.exports = {
  default: defaultTask,
};
