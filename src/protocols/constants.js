'use strict';

const { mapValues, keyBy } = require('../utilities');

const protocolAdapters = require('./adapters');

const protocolAdaptersA = keyBy(protocolAdapters);

// All protocols
const PROTOCOLS = Object.keys(protocolAdaptersA);

// Retrieves protocol options
const getOpts = function () {
  return mapValues(protocolAdaptersA, ({ opts = {} }) => opts);
};

const PROTOCOL_OPTS = getOpts();

// Retrieves protocol defaults
const getDefaults = function () {
  return mapValues(protocolAdaptersA, ({ defaults = {} }) => defaults);
};

const PROTOCOL_DEFAULTS = getDefaults();

const CONSTANTS = {
  METHODS: [
    'GET',
    'HEAD',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
  ],

  PROTOCOLS,
  PROTOCOL_OPTS,
  PROTOCOL_DEFAULTS,
};

module.exports = CONSTANTS;
