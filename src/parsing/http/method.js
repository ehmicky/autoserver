'use strict';


const { EngineError } = require('../../error');


const getProtocolMethod = function ({
  specific: { req: { method: protocolMethod } },
}) {
  return protocolMethod;
};

/**
 * Turn a HTTP method into a protocol-agnostic method
 * Keep the protocol-specific method e.g. for logging/reporting
 **/
const getMethod = function ({ specific }) {
  const protocolMethod = getProtocolMethod({ specific });
  const method = methodMap[protocolMethod];
  if (!method) {
    const message = `Unsupported protocol method: ${protocolMethod}`;
    throw new EngineError(message, { reason: 'UNSUPPORTED_METHOD' });
  }
  return method;
};

const methodMap = {
  GET: 'find',
  HEAD: 'find',
  POST: 'create',
  PUT: 'replace',
  PATCH: 'update',
  DELETE: 'delete',
};


module.exports = {
  method: {
    getProtocolMethod,
    getMethod,
  },
};
