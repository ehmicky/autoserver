'use strict';

// Fill in `mInput.headers` using protocol-specific headers.
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
const parseHeaders = function ({ specific, protocolAdapter: { getHeaders } }) {
  if (getHeaders === undefined) { return; }

  const headers = getHeaders({ specific });
  return { headers };
};

module.exports = {
  parseHeaders,
};
