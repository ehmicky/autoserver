'use strict';

const { getNames, getMember } = require('../adapters');

const protocolAdapters = require('./adapters');

const PROTOCOLS = getNames(protocolAdapters);
const PROTOCOL_OPTS = getMember(protocolAdapters, 'opts', {});
const PROTOCOL_DEFAULTS = getMember(protocolAdapters, 'defaults', {});

module.exports = {
  PROTOCOLS,
  PROTOCOL_OPTS,
  PROTOCOL_DEFAULTS,
};
