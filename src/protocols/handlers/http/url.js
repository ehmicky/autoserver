'use strict';


const { format: urlFormat } = require('url');


// Retrieves origin, i.e. protocol + host + port
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

// Retrieves URL without query string nor hash
// Works with proxies.
const getUrl = function ({ specific }) {
  const origin = getOrigin({ specific });
  const pathname = getPath({ specific });

  const url = `${origin}${pathname}`;
  return url;
};


module.exports = {
  getOrigin,
  getPath,
  getUrl,
};
