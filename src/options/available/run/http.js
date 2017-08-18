'use strict';

// Runtime option `http.enabled`
const httpEnabled = {
  name: 'http.enabled',
  default: true,
  description: 'Whether HTTP server should start',
  group: 'HTTP:',
  validate: {
    type: 'boolean',
  },
};

// Runtime option `http.host`
const httpHost = {
  name: 'http.host',
  default: 'localhost',
  description: 'HTTP server\'s host',
  group: 'HTTP:',
  validate: {
    type: 'string',
  },
};

// Runtime option `http.port`
const httpPort = {
  name: 'http.port',
  default: 80,
  description: 'HTTP server\'s port',
  group: 'HTTP:',
  validate: {
    type: 'integer',
    minimum: 0,
    maximum: 65535,
  },
};

const httpObj = {
  name: 'http',
  default: {},
  description: 'HTTP server\'s options',
  group: 'HTTP:',
  validate: { type: 'object' },
};

module.exports = [
  httpObj,
  httpEnabled,
  httpHost,
  httpPort,
];
