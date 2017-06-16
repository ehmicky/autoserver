'use strict';


const { format: urlFormat, URL } = require('url');

const { EngineError } = require('../../../error');


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

// Retrieves query string from a URL, without leading ?
const getQueryString = function ({ specific: { req: { url } } }) {
  try {
    const { search = '' } = new URL(`http://localhost/${url}`);
    return search.replace(/^\?/, '');
  } catch (e) {
    const message = `Could not retrieve query string from: '${url}'`;
    throw new EngineError(message, { reason: 'QUERY_STRING_PARSE' });
  }
};


module.exports = {
  getOrigin,
  getPath,
  getQueryString,
};
