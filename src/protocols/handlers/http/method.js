'use strict';

// Retrieves HTTP method
const getMethod = function ({ specific: { req: { method } } }) {
  return method;
};

// Turn a HTTP method into a protocol-agnostic "goal"
const getGoal = function ({ method }) {
  return goalMap[method];
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
