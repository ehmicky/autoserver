'use strict';


const { EngineError } = require('../../error');


const getProtocolMethod = function ({
  specific: { req: { method: protocolMethod } },
}) {
  return protocolMethod;
};

// Turn a HTTP method into a protocol-agnostic "goal"
const getGoal = function ({ specific }) {
  const protocolMethod = getProtocolMethod({ specific });
  const goal = goalMap[protocolMethod];
  if (!goal) {
    const message = `Unsupported protocol method: ${protocolMethod}`;
    throw new EngineError(message, { reason: 'UNSUPPORTED_METHOD' });
  }
  return goal;
};

const goalMap = {
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
    getGoal,
  },
};
