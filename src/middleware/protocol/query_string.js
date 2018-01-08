'use strict';

const { parse } = require('../../formats');

// Fill in `mInput.queryvars` using protocol-specific URL query variables
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
// Automatic transtyping is performed
const parseQueryString = function ({
  specific,
  protocolAdapter: { getQueryString },
}) {
  const queryString = getQueryString({ specific });

  const queryvars = parse({ format: 'urlencoded', content: queryString });
  return { queryvars };
};

module.exports = {
  parseQueryString,
};
