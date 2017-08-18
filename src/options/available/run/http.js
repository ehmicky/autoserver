'use strict';

// Runtime option `http.enabled`
const httpEnabled = {
  name: 'http.enabled',
  default: true,
  validate: {
    type: 'boolean',
  },
};

// Runtime option `http.host`
const httpHost = {
  name: 'http.host',
  default: 'localhost',
  validate: {
    type: 'string',
  },
};

// Runtime option `http.port`
const httpPort = {
  name: 'http.port',
  default: 80,
  validate: {
    type: 'integer',
    minimum: 0,
    maximum: 65535,
  },
};

const httpObj = {
  name: 'http',
  default: {},
  validate: { type: 'object' },
};

module.exports = [
  httpObj,
  httpEnabled,
  httpHost,
  httpPort,
];
