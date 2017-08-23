'use strict';

const qs = require('qs');

const { throwError, addErrorHandler } = require('../../error');
const { transtype, mapValues } = require('../../utilities');

const MAX_DEPTH = 10;
const MAX_ARRAY_LENGTH = 100;

// Fill in `input.queryVars` using protocol-specific URL query variables
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
// Automatic transtyping is performed
// Meant to be used to create (in coming middleware) `input.settings` and
// `input.params`, but can also be used by operation layer as is.
const parseQueryString = function ({ specific, protocolHandler }) {
  const queryString = getQueryString({ specific, protocolHandler });
  const queryVars = eParseQueryVars({ queryString });

  const queryVarsA = mapValues(queryVars, value => transtype(value));
  return { queryVars: queryVarsA };
};

const getQueryString = function ({ specific, protocolHandler }) {
  const queryString = protocolHandler.getQueryString({ specific });

  if (typeof queryString !== 'string') {
    const message = `'queryString' must be a string, not '${queryString}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return queryString;
};

// Parse query string as query object
// Can use the following notations:
//  - ?var[subvar]=val -> { var: { subvar: val } }
//  - ?var.subvar=val -> { var: { subvar: val } }
//  - ?var[0]=val -> { var: [ val ] }
//  - ?var[]=val&var[]=secondval -> { var: [ val, secondval ] }
// Can be nested, with max 10 levels of depth
// Array max length is 100
// Performs proper URI decoding, using decodeURIComponent()
// Differentiates between undefined, null and '' (see serialize() below)
const parseQueryVars = function ({ queryString }) {
  const queryObject = qs.parse(queryString, {
    depth: MAX_DEPTH,
    arrayLimit: MAX_ARRAY_LENGTH,
    strictNullHandling: true,
    allowDots: true,
    decoder: str => decodeURIComponent(str.replace(/\+/g, ' ')),
  });
  return queryObject;
};

const eParseQueryVars = addErrorHandler(parseQueryVars, {
  message: ({ queryString }) =>
    `Request query string is invalid: '${queryString}'`,
  reason: 'QUERY_STRING_PARSE',
});

module.exports = {
  parseQueryString,
};
