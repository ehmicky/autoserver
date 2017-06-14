'use strict';


const qs = require('qs');
const { URL } = require('url');

const { EngineError } = require('../../error');


const MAX_DEPTH = 10;
const MAX_ARRAY_LENGTH = 100;

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
//
// @param {string|Url} url - Can either be a full URL, a path,
// a query string (with leading '?') or a URL object
// @returns {object} queryObject
const parse = function ({ specific: { req: { url } } }) {
  const queryString = getQueryString({ url });
  try {
    const queryObject = qs.parse(queryString, {
      depth: MAX_DEPTH,
      arrayLimit: MAX_ARRAY_LENGTH,
      strictNullHandling: true,
      allowDots: true,
      decoder: decodeValue,
    });
    return queryObject;
  } catch (innererror) {
    const message = `Request query string is invalid: ${url}`;
    throw new EngineError(message, {
      reason: 'QUERY_STRING_PARSE',
      innererror,
    });
  }
};

// Retrieves query string from a URL
//
// @param {string|Url} url - Can either be a full URL, a path,
// a query string (with leading '?') or a URL object
// @returns {string} query - does not include the leading `?`
const getQueryString = function ({ url }) {
  const urlObj = parseUrl({ url });
  const { search = '' } = urlObj;
  const queryString = search.replace(/^\?/, '');
  return queryString;
};

const parseUrl = function ({ url }) {
  if (url instanceof URL) { return url; }

  try {
    return new URL(url);
  } catch (e) {
    try {
      const origin = 'http://localhost';
      const slash = url.startsWith('/') ? '' : '/';
      return new URL(`${origin}${slash}${url}`);
    } catch (e) {
      const message = `Could not retrieve query string from: '${url}'`;
      throw new EngineError(message, { reason: 'QUERY_STRING_PARSE' });
    }
  }
};

const decodeValue = function (str) {
   return decodeURIComponent(str.replace(/\+/g, ' '));
};

// Serialize a plain object into a query string (without the leading '?')
// Performs proper URI encoding, using encodeURIComponent()
// Differentiates between:
//  - undefined, empty array or object with only empty properties -> no variable
//  - null -> ?var
//  - '' -> ?var=
// Serializes dates as well, but it will be parsed back (by parse()) as a string
//
// @param {object} queryObject
// @returns {string} queryString
const serialize = function (queryObject) {
  try {
    const queryString = qs.stringify(queryObject, {
      depth: MAX_DEPTH,
      arrayLimit: MAX_ARRAY_LENGTH,
      strictNullHandling: true,
    });
    return queryString;
  } catch (innererror) {
    const message = `Response query string is invalid: ${JSON.stringify(queryObject)}`;
    throw new EngineError(message, {
      reason: 'QUERY_STRING_SERIALIZE',
      innererror,
    });
  }
};


module.exports = {
  queryString: {
    parse,
    serialize,
  },
};
