'use strict';

const { throwError } = require('../../error');

// Fill in `mInput.origin`
const parseOrigin = function ({ protocolHandler, specific }) {
  const origin = protocolHandler.getOrigin({ specific });

  validateOrigin({ origin });

  return { origin };
};

const validateOrigin = function ({ origin }) {
  if (typeof origin === 'string') { return; }

  const message = `'origin' must be a string, not '${origin}'`;
  throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
};

module.exports = {
  parseOrigin,
};
