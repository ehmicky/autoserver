'use strict';

/**
 * Parses and serializes HTTP headers, used as parameters, i.e. namespaced
 */

const { titleize, dasherize } = require('underscore.string');
const { chain, mapKeys } = require('lodash');

// Headers that provide application data, not just HTTP protocol semantics
// Must all be lowercase
const PARAM_HEADERS = [
];


/**
 * Returns a request's or response's HTTP headers
 * Only returns the namespaced ones, e.g. X-MYNAMESPACE-HEADER,
 * and remove their namespace
 * Also returns the headers that provide application data,
 * not just HTTP protocol semantics, according to a whitelist.
 *
 * @param {req|res} reqOrRes - HTTP request or response object
 * @param {string} projectName - MYNAMESPACE
 * @returns {object} appHeaders
 */
const parse = function (reqOrRes, projectName) {
  const headers = getHeaders(reqOrRes);
  const appHeaders = getAppHeaders(headers, projectName);

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
const getAppHeaders = function (headers, projectName) {
  const headersNamespace = `x-${dasherize(projectName)}-`;
  // We don't need to RegExp-escape since `headersNamespace` only contains
  // ASCII letters, numbers and dashes
  const appHeaderRegex = new RegExp(`^${headersNamespace}`);
  return chain(headers)
    .pickBy((_, headerName) => appHeaderRegex.test(headerName) ||
      PARAM_HEADERS.includes(headerName))
    .mapKeys((_, headerName) => headerName.replace(appHeaderRegex, ''))
    .value();
};

/**
 * Take a plain object of parameters, and transforms it in an object that
 * can be set as headers to a HTTP request or response
 * Namespaces headers names, e.g. X-Mynamespace-Header,
 * unless part of a whitelist
 *
 * @param {object} appHeaders
 * @param {string} projectName - MYNAMESPACE
 * @returns {object} headers
 */
const serialize = function (headers, projectName) {
  const headersNamespace = `x-${dasherize(projectName)}-`;
  return mapKeys(headers, (_, headerName) => {
    if (!PARAM_HEADERS.includes(headerName.toLowerCase())) {
      headerName = `${headersNamespace}${headerName}`;
    }
    // Make sure case is X-Mynamespace-Header
    return titleize(headerName);
  });
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
