'use strict';


const { format: urlFormat } = require('url');

const { httpHeaders } = require('../../../parsing');


const httpGetPath = async function (input) {
  const { req } = input;

  req[Symbol.for('requestUrl')] = getRequestUrl({ req });
  const path = getPath(req.url);

  const output = Object.assign({}, input, { path });
  const response = await this.next(output);
  return response;
};

const getPath = function (url) {
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
    pathname: getPath(req.url),
  });

  return requestUrl;
};


module.exports = {
  httpGetPath,
};