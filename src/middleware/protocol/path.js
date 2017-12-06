'use strict';

const { validateProtocolString } = require('./validate_parsing');

// Fill in `mInput.path`: URL's path, e.g. used by router
// Uses protocol-specific URL retrieval, but are set in a
// protocol-agnostic format, i.e. each protocol sets the same strings.
const parsePath = function ({ protocolAdapter: { getPath }, specific }) {
  if (getPath === undefined) { return; }

  const path = getPath({ specific });
  validateProtocolString({ path });

  return { path };
};

module.exports = {
  parsePath,
};
