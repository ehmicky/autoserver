'use strict';

// Retrieves HTTP method, but protocol-agnostic
const getMethod = function ({ specific: { req: { method } } }) {
  return methodsMap[method];
};

const methodsMap = {
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
