'use strict';

const { SYSTEM_VARS, TEMP_SYSTEM_VARS } = require('./system');

// Retrieve schema functions variables names
const getVarsKeys = function ({ schema: { variables = {} } }) {
  return [
    ...Object.keys(SYSTEM_VARS),
    ...TEMP_SYSTEM_VARS,
    ...Object.keys(variables),
  ];
};

module.exports = {
  getVarsKeys,
};
