'use strict';


const { defaultsDeep } = require('lodash');

const { getReason, getErrorReason } = require('../../error');


// Applies generic error information
const processError = function ({ error }) {
  if (!(error instanceof Error)) {
    error = new Error(String(error));
  }

  error.reason = getReason({ error });

  const { generic: genericErrorInput } = getErrorReason({ error });
  defaultsDeep(error, genericErrorInput);

  return error;
};


module.exports = {
  processError,
};
