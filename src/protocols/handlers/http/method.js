'use strict';

// Retrieves HTTP method, but protocol-agnostic
const getMethod = function ({ specific: { req: { method } } }) {
  return METHODS_MAP[method];
};

const METHODS_MAP = {
  GET: 'GET',
  HEAD: 'HEAD',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

module.exports = {
  getMethod,
};
