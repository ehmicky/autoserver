'use strict';

// Retrieves HTTP method, but protocol-agnostic
const getMethod = function ({ specific: { req: { method } } }) {
  return METHODS_MAP[method];
};

const METHODS_MAP = {
  GET: 'find',
  HEAD: 'find',
  POST: 'create',
  PUT: 'replace',
  PATCH: 'patch',
  DELETE: 'delete',
};

module.exports = {
  getMethod,
};
