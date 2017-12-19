'use strict';

const { addGenErrorHandler } = require('../../errors');
const { parse } = require('../../formats');

const { validateProtocolString } = require('./validate_parsing');

// Fill in `mInput.queryvars` using protocol-specific URL query variables
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
// Automatic transtyping is performed
const parseQueryString = function ({ specific, protocolAdapter }) {
  const queryString = eFindQueryString({ specific, protocolAdapter });
  validateProtocolString({ queryString });

  const queryvars = eParseQueryvars({ queryString });
  return { queryvars };
};

const findQueryString = function ({
  specific,
  protocolAdapter: { getQueryString },
}) {
  return getQueryString({ specific });
};

const eFindQueryString = addGenErrorHandler(findQueryString, {
  message: 'Could not retrieve query string',
  reason: 'QUERY_STRING_PARSE',
});

const parseQueryvars = function ({ queryString }) {
  return parse({ format: 'urlencoded', content: queryString });
};

const eParseQueryvars = addGenErrorHandler(parseQueryvars, {
  message: ({ queryString }) =>
    `Request query string is invalid: '${queryString}'`,
  reason: 'QUERY_STRING_PARSE',
});

module.exports = {
  parseQueryString,
};
