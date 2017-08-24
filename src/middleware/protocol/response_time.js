'use strict';

const { throwError } = require('../../error');
const { stopPerf } = require('../../perf');

// Request response time, from request handling start to response sending
// Note that other functions might happen after response sending, e.g. events
const setResponseTime = function ({ reqPerf, protocolHandler, specific }) {
  const { respPerf, responseTime } = getResponseTime({ reqPerf });

  sendHeaders({ protocolHandler, specific, responseTime });

  return { respPerf, responseTime };
};

const getResponseTime = function ({ reqPerf }) {
  const respPerf = stopPerf(reqPerf);

  const responseTime = Math.round(respPerf.duration / 10 ** 6);

  if (typeof responseTime !== 'number') {
    const message = `'responseTime' must be a number, not '${responseTime}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return { respPerf, responseTime };
};

const sendHeaders = function ({ protocolHandler, specific, responseTime }) {
  const headers = { 'X-Response-Time': responseTime };
  protocolHandler.sendHeaders({ specific, headers });
};

module.exports = {
  setResponseTime,
};
