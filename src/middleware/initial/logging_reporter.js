'use strict';

const { rethrowError, normalizeError } = require('../../error');
const { unbufferLogReports } = require('../../logging');

// Execute logging reports that were fired during that call
const loggingReporter = async function (nextFunc, input) {
  try {
    const response = await nextFunc(input);

    const { log } = response;
    const responseA = await unbufferLogReports(response, log);

    return responseA;
  } catch (error) {
    const errorA = normalizeError({ error });

    const { log } = errorA;
    const errorB = await unbufferLogReports(errorA, log);

    rethrowError(errorB);
  }
};

module.exports = {
  loggingReporter,
};
