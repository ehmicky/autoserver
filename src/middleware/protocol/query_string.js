'use strict';

const qs = require('qs');

const { throwError } = require('../../error');
const { transtype, mapValues, makeImmutable } = require('../../utilities');
const { addLogInfo } = require('../../logging');

const MAX_DEPTH = 10;
const MAX_ARRAY_LENGTH = 100;

// Fill in `input.queryVars` using protocol-specific URL query variables
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
// Automatic transtyping is performed
// Meant to be used to create (in coming middleware) `input.settings` and
// `input.params`, but can also be used by operation layer as is.
const parseQueryString = async function (nextFunc, input) {
  const { specific, protocolHandler } = input;

  const queryVars = getQueryVars({ specific, protocolHandler });
  makeImmutable(queryVars);

  const newInput = addLogInfo(input, { queryVars });
  const nextInput = Object.assign({}, newInput, { queryVars });

  const response = await nextFunc(nextInput);
  return response;
};

// Retrieves query variables
const getQueryVars = function ({ specific, protocolHandler }) {
  const queryString = getQueryString({ specific, protocolHandler });
  const queryVars = parseQueryVars({ queryString });

  const transtypedQueryVars = mapValues(queryVars, value => transtype(value));
  return transtypedQueryVars;
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
  try {
    const queryObject = qs.parse(queryString, {
      depth: MAX_DEPTH,
      arrayLimit: MAX_ARRAY_LENGTH,
      strictNullHandling: true,
      allowDots: true,
      decoder: str => decodeURIComponent(str.replace(/\+/g, ' ')),
    });
    return queryObject;
  } catch (error) {
    const message = `Request query string is invalid: '${queryString}'`;
    throwError(message, {
      reason: 'QUERY_STRING_PARSE',
      innererror: error,
    });
  }
};

module.exports = {
  parseQueryString,
};
