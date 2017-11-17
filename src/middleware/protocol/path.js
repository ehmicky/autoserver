'use strict';

const { throwError } = require('../../error');

// Fill in `mInput.path`: URL's path, e.g. used by router
// Uses protocol-specific URL retrieval, but are set in a
// protocol-agnostic format, i.e. each protocol sets the same strings.
const parsePath = function ({ protocolHandler: { getPath }, specific }) {
  const path = getPath({ specific });
  validatePath({ path });

  return { path };
};

const validatePath = function ({ path }) {
  if (typeof path === 'string') { return; }

  const message = `'path' must be a string, not '${path}'`;
  throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
};

module.exports = {
  parsePath,
};
