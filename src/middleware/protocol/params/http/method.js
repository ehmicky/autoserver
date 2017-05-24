'use strict';


const { EngineError } = require('../../../../error');


/**
 * Turn a HTTP method into a protocol-agnostic method
 * Keep the protocol-specific method e.g. for logging/reporting
 **/
const getMethod = function ({ req: { method: protocolMethod } }) {
  const method = methodMap[protocolMethod];
  if (!method) {
    const message = `Unsupported protocol method: ${protocolMethod}`;
    throw new EngineError(message, { reason: 'UNSUPPORTED_METHOD' });
  }
  return { method, protocolMethod };
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
  getMethod,
};
