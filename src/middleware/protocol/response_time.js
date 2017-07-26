'use strict';

const { throwError } = require('../../error');
const { stopPerf } = require('../../perf');

const setResponseTime = async function (nextFunc, input) {
  const { log } = input;

  const response = await nextFunc(input);

  const { responseTime, respPerf } = getResponseTime({ input });

  log.add({ responseTime });

  sendHeaders({ input, responseTime });

  const newResponse = Object.assign({}, response, { respPerf });
  return newResponse;
};

const getResponseTime = function ({ input: { reqPerf } }) {
  const respPerf = stopPerf(reqPerf);
  const responseTime = Math.round(respPerf, respPerf.duration / 10 ** 6);

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
