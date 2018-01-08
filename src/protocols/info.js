'use strict';

const { mapValues } = require('../utilities');

const { protocolAdapters } = require('./merger');

// Retrieves protocol options
const getOpts = function () {
  return mapValues(protocolAdapters, ({ opts = {} }) => opts);
};

const PROTOCOL_OPTS = getOpts();

// Retrieves protocol defaults
const getDefaults = function () {
  return mapValues(protocolAdapters, ({ defaults = {} }) => defaults);
};

const PROTOCOL_DEFAULTS = getDefaults();

module.exports = {
  PROTOCOL_OPTS,
  PROTOCOL_DEFAULTS,
};
