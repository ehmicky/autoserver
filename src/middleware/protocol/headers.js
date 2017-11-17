'use strict';

const { validateProtocolObject } = require('./validate_parsing');

// Fill in `mInput.headers` using protocol-specific headers.
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
const parseHeaders = function ({ specific, protocolHandler: { getHeaders } }) {
  if (getHeaders === undefined) { return; }

  const headers = getHeaders({ specific });
  validateProtocolObject({ headers });

  return { headers };
};

module.exports = {
  parseHeaders,
};
