'use strict';

const { uniq } = require('../utilities');

const COMMANDS = require('./commands');

const TYPES = COMMANDS.map(({ type }) => type);
const COMMAND_TYPES = uniq(TYPES);

// Merge each action `commandpath` into a comma-separated list
const mergeCommandpaths = function ({ actions }) {
  const commandpathA = actions
    .map(({ commandpath }) => commandpath.join('.'))
    .join(', ');
  const clientCommandpathA = actions
    .map(({ clientCommandpath }) => clientCommandpath.join('.'))
    .join(', ');
  return { commandpath: commandpathA, clientCommandpath: clientCommandpathA };
};

module.exports = {
  COMMANDS,
  COMMAND_TYPES,
  mergeCommandpaths,
};
