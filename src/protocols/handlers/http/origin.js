'use strict';

const { format: urlFormat } = require('url');

// Retrieves full URL
const getUrl = function ({ specific, specific: { req: { url } } }) {
  const origin = getOrigin({ specific });
  return `${origin}${url}`;
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
  getOrigin,
};
