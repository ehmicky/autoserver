'use strict';

const { throwError } = require('../../error');

// Check if protocol method is allowed for current operation
const methodCheck = function ({ operationHandler: { methods }, method }) {
  if (methods.includes(method)) { return; }

  const message = 'Protocol method is not allowed';
  throwError(message, { reason: 'WRONG_METHOD' });
};

module.exports = {
  methodCheck,
};
