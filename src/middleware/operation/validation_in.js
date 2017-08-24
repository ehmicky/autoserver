'use strict';

const { throwError } = require('../../error');

// Operation middleware mInput validation
// Those errors should not happen, i.e. server-side (e.g. 500)
const operationValidationIn = function ({ operation, route }) {
  if (!operation) {
    const message = `Unsupported operation: ${route}`;
    throwError(message, { reason: 'UNSUPPORTED_OPERATION' });
  }
};

module.exports = {
  operationValidationIn,
};
