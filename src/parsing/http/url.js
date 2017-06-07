'use strict';


const { format: urlFormat } = require('url');


// Retrieve full URL
const getFullUrl = function ({ specific: { req: { url } } }) {
  return url;
};

// Retrieves path, e.g. used by the router
const getPath = function ({ specific }) {
  const fullUrl = getFullUrl({ specific });
  return fullUrl.replace(/[?#].*/, '');
};

// Keeps reference of request URL, so error handler can use it in output
const getUrl = function ({ specific }) {
  const { req } = specific;

  const nonProxiedProtocol = req.connection.encrypted ? 'https' : 'http';
  const proxiedProtocol = req.headers['x-forwarded-proto'];
  const protocol = proxiedProtocol || nonProxiedProtocol;

  const host = req.headers['host'];
  const pathname = getPath({ specific });

  const url = urlFormat({ protocol, host, pathname });
  return url;
};


module.exports = {
  url: {
    getFullUrl,
    getPath,
    getUrl,
  },
};
