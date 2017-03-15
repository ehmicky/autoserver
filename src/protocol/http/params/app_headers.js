'use strict';

/**
 * Parses and serializes HTTP headers, used as parameters, i.e. namespaced
 */

const NAMESPACE = require('../../../constants').NAMESPACE;
const HEADERS_NAMESPACE = `x-${NAMESPACE.toLowerCase()}-`;
// Headers that provide application data, not just HTTP protocol semantics
// Must all be lowercase
const PARAM_HEADERS = [
  'example',
];


/**
 * Returns a request's or response's HTTP headers
 * Only returns the namespaced ones, e.g. X-MYNAMESPACE-HEADER, and remove their namespace
 * Also returns the headers that provide application data, not just HTTP protocol semantics, according to a whitelist.
 *
 * @param reqOrRes {req|res}: HTTP request or response object
 * @returns headers {object}
 */
const parse = function (reqOrRes) {
  const headers = getHeaders(reqOrRes);
  const appHeaders = getAppHeaders(headers);

  return appHeaders;
};

// Returns request or response headers
const getHeaders = function (reqOrRes) {
  // Is a response
  if (reqOrRes.getHeaders) {
    return reqOrRes.getHeaders();
  // Is a request
  } else if (reqOrRes.headers) {
    return reqOrRes.headers;
  } else {
    return {};
  }
};

// Filters headers with only the headers whose name starts with X-NAMESPACE-
const getAppHeaders = function (headers) {
  return Object.keys(headers).reduce((appHeaders, headerName) => {
    const normalizedHeaderName = headerName.toLowerCase();
    const appHeaderRegex = new RegExp(`^${HEADERS_NAMESPACE}`);
    if (appHeaderRegex.test(normalizedHeaderName) || PARAM_HEADERS.includes(normalizedHeaderName)) {
      const shortHeaderName = normalizedHeaderName.replace(appHeaderRegex, '');
      appHeaders[shortHeaderName] = headers[headerName];
    }
    return appHeaders;
  }, {});
};

/**
 * Take a plain object of parameters, and transforms it in an object that can be set as headers to a HTTP request or response
 * Namespaces headers names, e.g. X-MYNAMESPACE-HEADER, unless part of a whitelist
 *
 * @param appHeaders {object}
 * @returns headers {object}
 */
const serialize = function (appHeaders) {
  return Object.keys(appHeaders).reduce((headers, appHeaderName) => {
    let normalizedHeaderName = appHeaderName.toLowerCase();
    if (!PARAM_HEADERS.includes(normalizedHeaderName)) {
      normalizedHeaderName = `${HEADERS_NAMESPACE}${normalizedHeaderName}`;
    }
    headers[normalizedHeaderName.toUpperCase()] = appHeaders[appHeaderName];
    return headers
  }, {});
};


module.exports = {
  parse,
  serialize,
};