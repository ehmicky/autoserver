'use strict';

const { EngineError } = require('../../error');

// Converts from no format to Protocol format
const protocolConvertor = async function ({
  specific,
  idl,
  serverOpts,
  apiServer,
  log,
  perf,
  protocol,
  protocolHandler,
  now,
}) {
  if (!specific || specific.constructor !== Object) {
    const message = `'specific' must be an object, not ${specific}`;
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  const newInput = {
    specific,
    idl,
    serverOpts,
    apiServer,
    log,
    perf,
    protocol,
    protocolHandler,
    now,
  };

  const response = await this.next(newInput);
  return response;
};

module.exports = {
  protocolConvertor,
};
