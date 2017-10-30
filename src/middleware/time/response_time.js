'use strict';

const { throwError } = require('../../error');
const { stopPerf } = require('../../perf');

// Request response time, from request handling start to response sending
// Note that other functions might happen after response sending, e.g. events
const setResponseTime = function ({ reqPerf, protocolHandler, specific }) {
  const { respPerf, responseTime } = getResponseTime({ reqPerf });

  setHeaders({ protocolHandler, specific, responseTime });

  return { respPerf, responseTime };
};

const getResponseTime = function ({ reqPerf }) {
  const respPerf = stopPerf(reqPerf);

  const responseTime = Math.round(respPerf.duration / MICROSECS_TO_SECS);

  if (typeof responseTime !== 'number') {
    const message = `'responseTime' must be a number, not '${responseTime}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return { respPerf, responseTime };
};

const MICROSECS_TO_SECS = 1e6;

const setHeaders = function ({ protocolHandler, specific, responseTime }) {
  const responseHeaders = { 'X-Response-Time': responseTime };
  protocolHandler.setResponseHeaders({ specific, responseHeaders });
};

module.exports = {
  setResponseTime,
};
