'use strict';

const { rethrowError, normalizeError } = require('../../error');
const { unbufferEventReports } = require('../../events');

// Execute events reports that were fired during that call
const eventsReporter = async function (nextFunc, input) {
  try {
    const response = await nextFunc(input);

    const { log } = response;
    const responseA = await unbufferEventReports(response, log);

    return responseA;
  } catch (error) {
    const errorA = normalizeError({ error });

    const { log } = errorA;
    const errorB = await unbufferEventReports(errorA, log);

    rethrowError(errorB);
  }
};

module.exports = {
  eventsReporter,
};
