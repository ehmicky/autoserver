'use strict';


const { defaultsDeep } = require('lodash');


// Apply HTTP-specific error information
const httpProcessError = function ({
  error,
  input: { protocol: { specific } },
}) {
  const status = (error.extra && error.extra.status) || 500;
  // Status is used by sendResponse
  Object.assign(specific, { status });
  // It is also rendered in the output
  defaultsDeep(error, { status });
};


module.exports = {
  httpProcessError,
};
