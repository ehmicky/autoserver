'use strict';

const { format: urlFormat, URL } = require('url');

// Retrieves origin, i.e. protocol + hostname + port
const getOrigin = function ({
  specific: {
    req: {
      headers,
      connection: { encrypted },
    },
  },
}) {
  const nonProxiedProtocol = encrypted ? 'https' : 'http';
  const proxiedProtocol = headers['x-forwarded-proto'];
  const protocol = proxiedProtocol || nonProxiedProtocol;

  const nonProxiedHost = headers.host;
  const proxiedHost = headers['x-forwarded-host'];
  const host = proxiedHost || nonProxiedHost;

  const origin = urlFormat({ protocol, host });
  return origin;
};

// Retrieves path without query string nor hash
const getPath = function ({ specific: { req: { url } } }) {
  return url.replace(/[?#].*/, '');
};

// Retrieves query string from a URL
const getQueryString = function ({ specific: { req: { url } } }) {
  const { search = '' } = new URL(`http://localhost/${url}`);
  return search;
};

module.exports = {
  getOrigin,
  getPath,
  getQueryString,
};
