'use strict';

const { throwError } = require('../../error');

// Check if protocol method is allowed for current rpc
const methodCheck = function ({ rpcHandler: { methods }, method }) {
  if (methods === undefined || methods.includes(method)) { return; }

  const message = 'Protocol method is not allowed';
  throwError(message, { reason: 'WRONG_METHOD' });
};

module.exports = {
  methodCheck,
};
