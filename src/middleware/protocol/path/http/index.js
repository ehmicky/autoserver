'use strict';


const { format: urlFormat } = require('url');


const httpGetPath = function () {
  return function ({ specific: { req }, headers }) {
    const path = getPath({ req });
    const url = getUrl({ req, headers });

    return { url, path };
  };
};

// Retrieves path, e.g. used by the router
const getPath = function ({ req: { url } }) {
  return url.replace(/[?#].*/, '');
};

// Keeps reference of request URL, so error handler can use it in output
const getUrl = function ({ req, headers }) {
  const protocol = req.connection.encrypted ? 'https' : 'http';
  const proxiedProtocol = headers['x-forwarded-proto'];
  const host = headers['host'];
  const url = urlFormat({
    protocol: proxiedProtocol || protocol,
    host,
    pathname: getPath({ req }),
  });

  return url;
};


module.exports = {
  httpGetPath,
};
