'use strict';

// Retrieves `topArgs`
const getTopArgs = function ({ operation: { args } }) {
  return args;
};

module.exports = {
  getTopArgs,
};
