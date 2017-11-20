'use strict';

const { uniq } = require('../utilities');

const COMMANDS = require('./commands');

const TYPES = COMMANDS.map(({ type }) => type);
const COMMAND_TYPES = uniq(TYPES);

// Merge each action `commandpath` into a comma-separated list
const mergeCommandpaths = function ({ actions }) {
  return actions
    .map(({ commandpath }) => commandpath.join('.'))
    .join(', ');
};

module.exports = {
  COMMANDS,
  COMMAND_TYPES,
  mergeCommandpaths,
};
