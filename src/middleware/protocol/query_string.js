'use strict';

const { addGenErrorHandler } = require('../../error');
const { parse } = require('../../formats');

// Fill in `mInput.queryvars` using protocol-specific URL query variables
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
// Automatic transtyping is performed
// Meant to be used to create (in coming middleware) `mInput.args`
// but can also be used by rpc layer as is.
const parseQueryString = function ({ specific, protocolHandler }) {
  const queryString = eGetQueryString({ specific, protocolHandler });

  const queryvars = eParseQueryvars({ queryString });
  return { queryvars };
};

const getQueryString = function ({ specific, protocolHandler }) {
  return protocolHandler.getQueryString({ specific });
};

const eGetQueryString = addGenErrorHandler(getQueryString, {
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
