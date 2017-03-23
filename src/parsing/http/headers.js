'use strict';

/**
 * Parses and serializes HTTP headers, used as parameters, i.e. namespaced
 */

const titleize = require('underscore.string/titleize');

const NAMESPACE = require('../../utilities').CONSTANTS.NAMESPACE;
const HEADERS_NAMESPACE = `x-${NAMESPACE.toLowerCase()}-`;
// Headers that provide application data, not just HTTP protocol semantics
// Must all be lowercase
const PARAM_HEADERS = [
];


/**
 * Returns a request's or response's HTTP headers
 * Only returns the namespaced ones, e.g. X-MYNAMESPACE-HEADER, and remove their namespace
 * Also returns the headers that provide application data, not just HTTP protocol semantics, according to a whitelist.
 *
 * @param {req|res} reqOrRes - HTTP request or response object
 * @returns {object} appHeaders
 */
const parse = function (reqOrRes) {
  const headers = getHeaders(reqOrRes);
  const appHeaders = getAppHeaders(headers);

  return appHeaders;
};

// Returns request or response headers
// Note that node.js automatically converts header names to lowercase
const getHeaders = function (reqOrRes) {
  // Is a response
  if (reqOrRes.getHeaders) {
    return reqOrRes.getHeaders();
  // Is a request
  } else {
    return reqOrRes.headers || {};
  }
};
const getHeader = function (reqOrRes, headerName) {
  return getHeaders(reqOrRes)[headerName.toLowerCase()];
};

// Filters headers with only the headers whose name starts with X-NAMESPACE-
const getAppHeaders = function (headers) {
  return Object.keys(headers).reduce((appHeaders, headerName) => {
    const appHeaderRegex = new RegExp(`^${HEADERS_NAMESPACE}`);
    if (appHeaderRegex.test(headerName) || PARAM_HEADERS.includes(headerName)) {
      const shortHeaderName = headerName.replace(appHeaderRegex, '');
      appHeaders[shortHeaderName] = headers[headerName];
    }
    return appHeaders;
  }, {});
};

/**
 * Take a plain object of parameters, and transforms it in an object that can be set as headers to a HTTP request or response
 * Namespaces headers names, e.g. X-Mynamespace-Header, unless part of a whitelist
 *
 * @param {object} appHeaders
 * @returns {object} headers
 */
const serialize = function (appHeaders) {
  return Object.keys(appHeaders).reduce((headers, appHeaderName) => {
    let normalizedHeaderName = appHeaderName.toLowerCase();
    if (!PARAM_HEADERS.includes(normalizedHeaderName)) {
      normalizedHeaderName = `${HEADERS_NAMESPACE}${normalizedHeaderName}`;
    }
    // Make sure case is X-Mynamespace-Header
    normalizedHeaderName = titleize(normalizedHeaderName);
    headers[normalizedHeaderName] = appHeaders[appHeaderName];
    return headers;
  }, {});
};


module.exports = {
  httpAppHeaders: {
    parse,
    serialize,
  },
  httpHeaders: {
    get: getHeader,
    getAll: getHeaders,
  },
};