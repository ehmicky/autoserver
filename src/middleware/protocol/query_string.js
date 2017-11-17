'use strict';

const { throwError, addGenErrorHandler } = require('../../error');
const { parse } = require('../../formats');

// Fill in `mInput.queryvars` using protocol-specific URL query variables
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
// Automatic transtyping is performed
const parseQueryString = function ({ specific, protocolHandler }) {
  const queryString = eFindQueryString({ specific, protocolHandler });
  validateQueryString({ queryString });

  const queryvars = eParseQueryvars({ queryString });
  return { queryvars };
};

const findQueryString = function ({
  specific,
  protocolHandler: { getQueryString },
}) {
  return getQueryString({ specific });
};

const eFindQueryString = addGenErrorHandler(findQueryString, {
  message: 'Could not retrieve query string',
  reason: 'QUERY_STRING_PARSE',
});

const validateQueryString = function ({ queryString }) {
  if (typeof queryString === 'string') { return; }

  const message = `'queryString' must be a string, not '${queryString}'`;
  throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
};

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
