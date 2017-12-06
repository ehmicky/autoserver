'use strict';

// Retrieves HTTP method, but protocol-agnostic
const getMethod = function ({ specific: { req: { method } } }) {
  return getAgnosticMethod({ method });
};

const getAgnosticMethod = function ({ method }) {
  if (typeof method !== 'string') { return method; }

  const methodA = METHODS_MAP[method.toUpperCase()];

  if (methodA === undefined) { return method; }

  return methodA;
};

// This looks strange, but this is just to enforce the fact that the HTTP
// method (the key) is conceptually different from the protocol-agnostic method
// (the value)
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
  getAgnosticMethod,
};
