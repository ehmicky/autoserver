'use strict';

const { throwError } = require('../../error');

// Check if protocol method is allowed for current rpc
const methodCheck = function ({ rpcAdapter: { methods, title }, method }) {
  const allowedMethod = methods === undefined ||
    methods.includes(method) ||
    // If only method is allowed by the rpc, but the protocol does not have
    // a getMethod(), we do not force specifying `method`
    (methods.length === 1 && method === undefined);
  if (allowedMethod) { return; }

  const message = `Protocol method '${method}' is not allowed with ${title}`;
  const allowedMethods = methods;
  throwError(message, { reason: 'WRONG_METHOD', extra: { allowedMethods } });
};

module.exports = {
  methodCheck,
};
