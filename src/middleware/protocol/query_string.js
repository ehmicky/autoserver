'use strict';

const { getFormat } = require('../../formats');

// Fill in `mInput.queryvars` using protocol-specific URL query variables
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
// Automatic transtyping is performed
const parseQueryString = function ({
  specific,
  protocolAdapter: { getQueryString },
}) {
  const queryString = getQueryString({ specific });

  const queryvars = urlencoded.parseContent(queryString);
  return { queryvars };
};

const urlencoded = getFormat('urlencoded');

module.exports = {
  parseQueryString,
};
