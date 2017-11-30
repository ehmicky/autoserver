'use strict';

const { format: urlFormat, URL } = require('url');

// Retrieves full URL
const getUrl = function ({ specific, specific: { req: { url } } }) {
  const origin = getOrigin({ specific });
  return `${origin}${url}`;
};

// Used by `Link` HTTP header
const getStandardUrl = function ({ specific }) {
  const url = getUrl({ specific });
  const urlA = new URL(url);
  return urlA;
};

const stringifyUrl = function ({ url }) {
  return urlFormat(url, { fragment: false });
};

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

module.exports = {
  getUrl,
  getStandardUrl,
  stringifyUrl,
  getOrigin,
};
