'use strict';

const { mapValues } = require('../utilities');

const { protocolAdapters } = require('./merger');

// All protocols
const PROTOCOLS = Object.keys(protocolAdapters);

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

const getProtocolTitle = function ({ protocol }) {
  const { title } = protocolAdapters[protocol] || {};
  return title;
};

module.exports = {
  PROTOCOLS,
  PROTOCOL_OPTS,
  PROTOCOL_DEFAULTS,
  getProtocolTitle,
};
