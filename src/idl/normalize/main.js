'use strict';

const { normalizeCommands } = require('./commands');
const { normalizeModels } = require('./models');
const { normalizeHelpers } = require('./helpers');
const { normalizeShortcuts } = require('./shortcuts');
const { normalizeGraphQL } = require('./graphql');

const normalizers = [
  normalizeCommands,
  normalizeModels,
  normalizeHelpers,
  normalizeShortcuts,
  normalizeGraphQL,
];

// Normalize IDL definition
const normalizeIdl = function ({ idl: oIdl, serverOpts, startupLog }) {
  return normalizers.reduce((idl, normalizer) => {
    const perf = startupLog.perf.start(normalizer.name, 'normalize');
    const newIdl = normalizer({ idl, serverOpts, startupLog });
    perf.stop();
    return newIdl;
  }, oIdl);
};

module.exports = {
  normalizeIdl,
};
