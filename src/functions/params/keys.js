'use strict';

const {
  SYSTEM_PARAMS,
  LATER_SYSTEM_PARAMS,
  POSITIONAL_PARAMS,
  TEMP_SYSTEM_PARAMS,
} = require('./system');

// Retrieve parameters names
const getParamsKeys = function ({ config: { params = {} } }) {
  const namedKeys = [
    ...Object.keys(SYSTEM_PARAMS),
    ...LATER_SYSTEM_PARAMS,
    ...TEMP_SYSTEM_PARAMS,
    ...Object.keys(params),
  ];
  const posKeys = POSITIONAL_PARAMS;
  return { namedKeys, posKeys };
};

module.exports = {
  getParamsKeys,
};
