'use strict';

const { throwError } = require('../errors');

// Check if protocol method is allowed for current rpc
const checkMethod = function ({ methods, title }, { method }) {
  if (isAllowedMethod({ methods, method })) { return; }

  const message = `Protocol method '${method}' is not allowed with ${title}`;
  const extra = { allowedMethods: methods };
  throwError(message, { reason: 'METHOD', extra });
};

const isAllowedMethod = function ({ methods, method }) {
  return methods === undefined ||
    methods.includes(method) ||
    // If only method is allowed by the rpc, but the protocol does not have
    // a getMethod(), we do not force specifying `method`
    (methods.length === 1 && method === undefined);
};

module.exports = {
  checkMethod,
};
