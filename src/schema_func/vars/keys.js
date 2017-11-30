'use strict';

const { SYSTEM_VARS } = require('./system');

// Retrieve schema functions variables names
const getVarsKeys = function ({ schema: { variables = {} } }) {
  return [...ALL_SYSTEM_VARS, ...Object.keys(variables)];
};

// Includes the system variables that are not always present
const ALL_SYSTEM_VARS = [
  ...Object.keys(SYSTEM_VARS),
  '$1',
  '$2',
  '$3',
  '$4',
  '$5',
  '$6',
  '$7',
  '$8',
  '$9',
  'expected',
  'model',
  'val',
  'previousmodel',
  'previousval',
  // Patch operators
  'arg',
  'type',
];

module.exports = {
  getVarsKeys,
};
