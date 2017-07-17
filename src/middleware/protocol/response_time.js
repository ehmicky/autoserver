'use strict';

const { EngineError } = require('../../error');

const setResponseTime = async function (input) {
  const { log, protocolHandler, specific } = input;

  const response = await this.next(input);
  const perf = log.perf.start('protocol.setResponseTime', 'middleware');

  const responseTime = log.perf.all.stop();
  if (typeof responseTime !== 'number') {
    const message = `'responseTime' must be a number, not '${responseTime}'`;
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  log.add({ responseTime });

  const headers = { 'X-Response-Time': Math.round(responseTime) };
  protocolHandler.sendHeaders({ specific, headers });

  perf.stop();
  return response;
};

module.exports = {
  setResponseTime,
};
