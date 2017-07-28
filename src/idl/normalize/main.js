'use strict';

const { monitoredReduce } = require('../../perf');

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
const normalizeIdl = function ({ idl, serverOpts }) {
  return monitoredReduce({
    funcs: normalizers,
    initialInput: idl,
    category: 'normalize',
    mapInput: idlA => ({ serverOpts, idl: idlA }),
  });
};

module.exports = {
  normalizeIdl,
};
