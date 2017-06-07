'use strict';

/**
 * Parses and serializes URL query strings
 * Can encode types such as: null, undefined, '', strings, integers, floats, booleans
 */


const qs = require('qs');
const urlParser = require('url');

const { EngineError } = require('../../error');


const MAX_DEPTH = 10;
const MAX_ARRAY_LENGTH = 100;

/**
 * Parse query string as query object
 * Can use the following notations:
 *  - ?var[subvar]=val -> { var: { subvar: val } }
 *  - ?var.subvar=val -> { var: { subvar: val } }
 *  - ?var[0]=val -> { var: [ val ] }
 *  - ?var[]=val&var[]=secondval -> { var: [ val, secondval ] }
 * Can be nested, with max 10 levels of depts
 * Array max length is 100
 * Performs proper URI decoding, using decodeURIComponent()
 * Differentiates between undefined, null and '' (see serialize() below)
 * Try to guess types: numbers, booleans, null
 *
 * @param {string|Url} url - Can either be a full URL, a path, a query string (with leading '?') or a URL object
 * @returns {object} queryObject
 */
const parse = function ({ specific: { req: { url } } }) {
  const queryString = getQueryString(url);
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
    throw new EngineError(`Request query string is invalid: ${url}`, { reason: 'QUERY_STRING_PARSE', innererror });
  }
};

/**
 * Retrieves query string from a URL
 *
 * @param {string|Url} url - Can either be a full URL, a path, a query string (with leading '?') or a URL object
 * @returns {string} query - does not include the leading `?`
 **/
const getQueryString = function (url) {
  if (!(url instanceof urlParser.URL)) {
    try {
      url = new urlParser.URL(url);
    } catch (e) {
      try {
        let path = url;
        if (!path.startsWith('/')) {
          path = `/${path}`;
        }
        url = new urlParser.URL(`http://localhost${path}`);
      } catch (e) {
        throw new EngineError(`Could not retrieve query string from: ${url}`, { reason: 'QUERY_STRING_PARSE' });
      }
    }
  }

  const queryString = (url.search || '').replace(/^\?/, '');
  return queryString;
};

const decodeValue = function (str) {
   return decodeURIComponent(str.replace(/\+/g, ' '));
};

/**
 * Serialize a plain object into a query string (without the leading '?')
 * Performs proper URI encoding, using encodeURIComponent()
 * Differentiates between:
 *  - undefined, empty array or object with only empty properties -> no variable
 *  - null -> ?var
 *  - '' -> ?var=
 * Serializes dates as well, but it will be parsed back (by parse()) as a string
 *
 * @param {object} queryObject
 * @returns {string} queryString
 */
const serialize = function (queryObject) {
  try {
    const queryString = qs.stringify(queryObject, {
      depth: MAX_DEPTH,
      arrayLimit: MAX_ARRAY_LENGTH,
      strictNullHandling: true,
    });
    return queryString;
  } catch (innererror) {
    throw new EngineError(`Response query string is invalid: ${JSON.stringify(queryObject)}`, {
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
