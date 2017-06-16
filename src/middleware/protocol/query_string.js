'use strict';


const qs = require('qs');

const { EngineError } = require('../../error');
const { transtype, mapValues, makeImmutable } = require('../../utilities');


const MAX_DEPTH = 10;
const MAX_ARRAY_LENGTH = 100;

// Fill in `input.queryVars` using protocol-specific URL query variables
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
// Automatic transtyping is performed
// Meant to be used to create (in coming middleware) `input.settings` and
// `input.params`, but can also be used by operation layer as is.
const parseQueryString = async function (input) {
  const { specific, protocolHandler, log } = input;
  const perf = log.perf.start('protocol.parseQueryString', 'middleware');

  const queryVars = getQueryVars({ specific, protocolHandler });
  makeImmutable(queryVars);

  log.add({ queryVars });
  Object.assign(input, { queryVars });

  perf.stop();
  const response = await this.next(input);
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
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
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
  } catch (innererror) {
    const message = `Request query string is invalid: '${queryString}'`;
    throw new EngineError(message, {
      reason: 'QUERY_STRING_PARSE',
      innererror,
    });
  }
};


module.exports = {
  parseQueryString,
};
