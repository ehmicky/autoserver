'use strict';

/**
 * Parses and serializes HTTP headers, used as parameters, i.e. namespaced
 */

const { titleize, dasherize } = require('underscore.string');
const { mapKeys } = require('lodash');
const parsePreferHeader = require('parse-prefer-header');

const { EngineError } = require('../../error');


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
  const nonAppHeaders = getNonAppHeaders(headers, projectName);
  const appHeaders = getAppHeaders(headers, projectName);

  return { nonAppHeaders, appHeaders };
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

// Filters headers with only the headers whose name starts with X-NAMESPACE-
const getAppHeaders = function (headers, projectName) {
  const headersNamespace = `x-${dasherize(projectName)}-`;
  // We don't need to RegExp-escape since `headersNamespace` only contains
  // ASCII letters, numbers and dashes
  const appHeaderRegex = new RegExp(`^${headersNamespace}`);
  return Object.entries(headers)
    .filter(([name]) => appHeaderRegex.test(name))
    .map(([name, value]) => {
      const shortName = name.replace(appHeaderRegex, '');
      return { [shortName]: value };
    })
    .reduce((memo, obj) => Object.assign(memo, obj), {});
};

// Inverse
const getNonAppHeaders = function (headers, projectName) {
  const headersNamespace = `x-${dasherize(projectName)}-`;
  const appHeaderRegex = new RegExp(`^${headersNamespace}`);
  return Object.entries(headers)
    .filter(([name]) => !appHeaderRegex.test(name))
    .map(([name, value]) => ({ [name]: value }))
    .reduce((memo, obj) => Object.assign(memo, obj), {});
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
const serializeAppHeaders = function (headers, projectName) {
  const headersNamespace = `x-${dasherize(projectName)}-`;
  return mapKeys(headers, (_, headerName) => {
    return titleize(`${headersNamespace}${headerName}`);
  });
};

// Parses Prefer HTTP header
const parsePrefer = function ({ headers: { prefer } }) {
  if (!prefer) { return {}; }

  try {
    return parsePreferHeader(prefer);
  } catch (error) {
    const message = `HTTP 'Prefer' header value syntax error: ${prefer}`;
    throw new EngineError(message, { reason: 'INPUT_VALIDATION' });
  }
};


module.exports = {
  httpHeaders: {
    parse,
    parsePrefer,
    serialize: serializeAppHeaders,
  },
};
