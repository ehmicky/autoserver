'use strict';

const { rethrowError, normalizeError } = require('../../error');
const { unbufferLogReports } = require('../../logging');

// Execute logging reports that were fired during that call
const loggingReporter = async function (nextFunc, input) {
  const { log } = input;

  try {
    const response = await nextFunc(input);

    const newResponse = await unbufferLogReports(response, log);

    return newResponse;
  } catch (error) {
    const errorObj = normalizeError({ error });

    const newError = await unbufferLogReports(errorObj, log);

    rethrowError(newError);
  }
};

module.exports = {
  loggingReporter,
};
