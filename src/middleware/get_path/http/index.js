'use strict';


const { format: urlFormat } = require('url');

const { httpHeaders } = require('../../../parsing');


const httpGetPath = function () {
  return function ({ protocol: { specific: { req } } }) {
    const path = getPath({ req });
    const requestUrl = getRequestUrl({ req });

    return { requestUrl, path };
  };
};

// Retrieves path, e.g. used by the router
const getPath = function ({ req: { url } }) {
  return url.replace(/[?#].*/, '');
};

// Keeps reference of request URL, so error handler can use it in output
const getRequestUrl = function ({ req }) {
  const protocol = req.connection.encrypted ? 'https' : 'http';
  const proxiedProtocol = httpHeaders.get(req, 'X-Forwarded-Proto');
  const host = httpHeaders.get(req, 'Host');
  const requestUrl = urlFormat({
    protocol: proxiedProtocol || protocol,
    host,
    pathname: getPath({ req }),
  });

  return requestUrl;
};


module.exports = {
  httpGetPath,
};
