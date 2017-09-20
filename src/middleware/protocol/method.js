'use strict';

const { throwError } = require('../../error');

// Fill in:
//  - `mInput.method`: protocol-agnostic method, e.g. 'create'
// Meant to be used by operation layer.
const parseMethod = function ({ specific, protocolHandler }) {
  const method = protocolHandler.getMethod({ specific });

  if (!method) {
    const message = 'Unsupported protocol method';
    throwError(message, { reason: 'UNSUPPORTED_METHOD' });
  }

  return { method };
};

module.exports = {
  parseMethod,
};
