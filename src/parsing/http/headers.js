'use strict';


const parsePreferHeader = require('parse-prefer-header');

const { EngineError } = require('../../error');


// Returns a request's HTTP headers, normalized lowercase
const parse = function ({ specific: { req: { headers = {} } } }) {
  return headers;
};

// Parses Prefer HTTP header
const parsePrefer = function ({ headers: { prefer } }) {
  if (!prefer) { return {}; }

  try {
    return parsePreferHeader(prefer);
  } catch (error) {
    const message = `HTTP 'Prefer' header value syntax error: '${prefer}'`;
    throw new EngineError(message, { reason: 'INPUT_VALIDATION' });
  }
};

// Set HTTP header, ready to be sent with response
const send = function ({ specific: { res }, headers = {} }) {
  for (const [name, value] of Object.entries(headers)) {
    res.setHeader(name, value);
  }
};


module.exports = {
  headers: {
    parse,
    parsePrefer,
    send,
  },
};
