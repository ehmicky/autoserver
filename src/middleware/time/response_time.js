'use strict';

const { throwError } = require('../../error');
const { stopPerf } = require('../../perf');

// Request response time, from request handling start to response sending
// Note that other functions might happen after response sending, e.g. events
const setResponsetime = function ({ reqPerf, protocolHandler, specific }) {
  const { respPerf, responsetime } = getResponsetime({ reqPerf });

  setHeaders({ protocolHandler, specific, responsetime });

  return { respPerf, responsetime };
};

const getResponsetime = function ({ reqPerf }) {
  const respPerf = stopPerf(reqPerf);

  const responsetime = Math.round(respPerf.duration / MICROSECS_TO_SECS);

  if (typeof responsetime !== 'number') {
    const message = `'responsetime' must be a number, not '${responsetime}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return { respPerf, responsetime };
};

const MICROSECS_TO_SECS = 1e6;

const setHeaders = function ({ protocolHandler, specific, responsetime }) {
  const responseHeaders = { 'X-Response-Time': responsetime };
  protocolHandler.setResponseHeaders({ specific, responseHeaders });
};

module.exports = {
  setResponsetime,
};
