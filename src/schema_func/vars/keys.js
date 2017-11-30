'use strict';

const { SYSTEM_VARS } = require('./system');

// Retrieve schema functions variables names
const getVarsKeys = function ({ schema: { variables = {} } }) {
  return [...ALL_SYSTEM_VARS, ...Object.keys(variables)];
};

// Includes the system variables that are not always present
const ALL_SYSTEM_VARS = [
  ...Object.keys(SYSTEM_VARS),
  'arg1',
  'arg2',
  'arg3',
  'arg4',
  'arg5',
  'arg6',
  'arg7',
  'arg8',
  'arg9',
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
