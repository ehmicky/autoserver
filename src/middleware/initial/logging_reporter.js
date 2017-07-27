'use strict';

const { rethrowError, normalizeError } = require('../../error');
const { unbufferLogReports } = require('../../logging');

// Execute logging reports that were fired during that call
const loggingReporter = async function (nextFunc, input) {
  try {
    const response = await nextFunc(input);

    const { log } = response;
    const newResponse = await unbufferLogReports(response, log);

    return newResponse;
  } catch (error) {
    const errorObj = normalizeError({ error });

    const { log } = errorObj;
    const newError = await unbufferLogReports(errorObj, log);

    rethrowError(newError);
  }
};

module.exports = {
  loggingReporter,
};
