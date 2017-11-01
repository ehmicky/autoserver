'use strict';

const { uniq, assignArray } = require('../utilities');

const COMMANDS = require('./commands');

const TYPES = COMMANDS.map(({ type }) => type);
const COMMAND_TYPES = uniq(TYPES);

// Merge each action `commandPath` into a comma-separated list
const mergeCommandPaths = function ({ actions }) {
  return actions
    .map(({ commandPath }) => commandPath.join('.'))
    .reduce(assignArray, [])
    .join(', ');
};

module.exports = {
  COMMANDS,
  COMMAND_TYPES,
  mergeCommandPaths,
};
