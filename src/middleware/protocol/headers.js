'use strict';

const { validateProtocolObject } = require('./validate_parsing');

// Fill in `mInput.headers` using protocol-specific headers.
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
const parseHeaders = function ({
  specific,
  protocolHandler: { getHeaders },
  topargs = {},
}) {
  if (getHeaders === undefined) { return { topargs }; }

  const headers = getHeaders({ specific });
  validateProtocolObject({ headers });

  const topargsA = getTopargs({ topargs, headers });

  return { headers, topargs: topargsA };
};

// Client parameters can be specified in protocol headers
const getTopargs = function ({ topargs, headers: { params } }) {
  if (params === undefined) { return topargs; }

  return { ...topargs, params };
};

module.exports = {
  parseHeaders,
};
