'use strict';

const { promisify } = require('util');
const { chdir } = require('process');

const Nodemon = require('nodemon');

const nodemonDevConfig = require('../../nodemon');
const nodemonDebugConfig = require('../../nodemon.debug');
const { execCommand } = require('../utils');

const start = async function () {
  chdir('./examples');

  // We use this instead of requiring the application to test the CLI
  await execCommand('../bin/autoserver');
};

// eslint-disable-next-line fp/no-mutation
start.description = 'Start an example production server';

const dev = function () {
  return startNodemon(nodemonDevConfig);
};

// eslint-disable-next-line fp/no-mutation
dev.description = 'Start an example dev server in watch mode';

const debug = function () {
  return startNodemon(nodemonDebugConfig);
};

// eslint-disable-next-line fp/no-mutation
debug.description = 'Start an example dev server in debug mode';

const startNodemon = async function (config) {
  const nodemon = new Nodemon(config);

  // Otherwise Nodemon's log does not appear
  // eslint-disable-next-line no-restricted-globals
  nodemon.on('log', ({ colour }) => global.console.log(colour));

  await promisify(nodemon.on.bind(nodemon))('start');
};

module.exports = {
  start,
  dev,
  debug,
};
