'use strict';

const { reduceAsync } = require('../../utilities');

const { normalizeCommands } = require('./commands');
const { normalizeHelpers } = require('./helpers');
const { normalizeAttrsBefore, normalizeAttrsAfter } = require('./attribute');
const { normalizeModels } = require('./models');
const { normalizeGraphQL } = require('./graphql');
const { normalizeShortcuts } = require('./shortcuts');

const normalizers = [
  normalizeCommands,
  normalizeHelpers,
  normalizeAttrsBefore,
  normalizeModels,
  normalizeAttrsAfter,
  normalizeGraphQL,
  normalizeShortcuts,
];

// Normalize IDL definition
const normalizeIdl = function ({ idl: oIdl, serverOpts, startupLog }) {
  return reduceAsync(normalizers, async (idl, normalizer) => {
    const perf = startupLog.perf.start(normalizer.name, 'normalize');
    const newIdl = await normalizer({ idl, serverOpts, startupLog });
    perf.stop();
    return newIdl;
  }, oIdl);
};

module.exports = {
  normalizeIdl,
};
