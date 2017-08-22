'use strict';

const { throwError } = require('../../error');
const { stopPerf } = require('../../perf');
const { addReqInfo } = require('../../events');

// Request response time, from request handling start to response sending
// Note that other functions might happen after response sending, e.g. events
const setResponseTime = function (input) {
  const respPerf = stopPerf(input.reqPerf);
  const responseB = { ...input.response, respPerf };

  const responseTime = getResponseTime({ respPerf });

  addReqInfo(input, { responseTime });
  sendHeaders({ input, responseTime });

  return { ...input, response: responseB };
};

const getResponseTime = function ({ respPerf }) {
  const responseTime = Math.round(respPerf.duration / 10 ** 6);

  if (typeof responseTime !== 'number') {
    const message = `'responseTime' must be a number, not '${responseTime}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return responseTime;
};

const sendHeaders = function ({
  input: { protocolHandler, specific },
  responseTime,
}) {
  const headers = { 'X-Response-Time': Math.round(responseTime) };
  protocolHandler.sendHeaders({ specific, headers });
};

module.exports = {
  setResponseTime,
};
