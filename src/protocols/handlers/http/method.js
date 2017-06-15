'use strict';


const { EngineError } = require('../../../error');


// Retrieves HTTP method
const getMethod = function ({ specific: { req: { method } } }) {
  return method;
};

// Turn a HTTP method into a protocol-agnostic "goal"
const getGoal = function ({ specific }) {
  const method = getMethod({ specific });
  const goal = goalMap[method];
  if (!goal) {
    const message = `Unsupported protocol method: ${method}`;
    throw new EngineError(message, { reason: 'UNSUPPORTED_METHOD' });
  }
  return goal;
};

const goalMap = {
  GET: 'find',
  POST: 'create',
  PUT: 'replace',
  PATCH: 'update',
  DELETE: 'delete',
};


module.exports = {
  getMethod,
  getGoal,
};
