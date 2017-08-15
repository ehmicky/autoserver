'use strict';

// Runtime option `http.enabled`
const httpEnabled = {
  name: 'http.enabled',
  validate: {
    type: 'boolean',
  },
};

// Runtime option `http.host`
const httpHost = {
  name: 'http.host',
  validate: {
    type: 'string',
  },
};

// Runtime option `http.port`
const httpPort = {
  name: 'http.port',
  validate: {
    type: 'integer',
    minimum: 0,
    maximum: 65535,
  },
};

const httpObj = {
  name: 'http',
  validate: { type: 'object' },
};

module.exports = [
  httpObj,
  httpEnabled,
  httpHost,
  httpPort,
];
