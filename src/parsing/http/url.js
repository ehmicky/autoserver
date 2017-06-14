'use strict';


const { format: urlFormat } = require('url');


// Retrieves path without query string nor hash
const getPath = function ({ specific: { req: { url } } }) {
  return url.replace(/[?#].*/, '');
};

// Retrieves URL without query string nor hash
// Works with proxies.
const getUrl = function ({
  specific,
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

  const pathname = getPath({ specific });

  const url = urlFormat({ protocol, host, pathname });
  return url;
};


module.exports = {
  url: {
    getPath,
    getUrl,
  },
};
