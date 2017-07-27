'use strict';

const { throwError } = require('../../error');
const { stopPerf } = require('../../perf');
const { addLogInfo } = require('../../logging');

// Request response time, from request handling start to response sending
// Note that other functions might happen after response sending, e.g. logging
const setResponseTime = async function (nextFunc, input) {
  const response = await nextFunc(input);

  const { responseTime, respPerf } = getResponseTime({ input });

  const nextResponse = addLogInfo(response, { responseTime });
  const newResponse = Object.assign({}, nextResponse, { respPerf });

  sendHeaders({ input, responseTime });

  return newResponse;
};

const getResponseTime = function ({ input: { reqPerf } }) {
  const respPerf = stopPerf(reqPerf);
  const responseTime = Math.round(respPerf.duration / 10 ** 6);

  if (typeof responseTime !== 'number') {
    const message = `'responseTime' must be a number, not '${responseTime}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return { responseTime, respPerf };
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
