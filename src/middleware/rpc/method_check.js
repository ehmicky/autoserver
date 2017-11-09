'use strict';

const { throwError } = require('../../error');

// Check if protocol method is allowed for current rpc
const methodCheck = function ({ rpcHandler: { methods, title }, method }) {
  if (methods === undefined || methods.includes(method)) { return; }

  const message = `Protocol method '${method}' is not allowed with ${title}`;
  throwError(message, { reason: 'WRONG_METHOD' });
};

module.exports = {
  methodCheck,
};
