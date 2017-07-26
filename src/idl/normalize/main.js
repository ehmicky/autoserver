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
const normalizeIdl = async function ({ idl: oIdl, serverOpts }) {
  const initialInput = { serverOpts, idl: oIdl };
  const [{ idl: newIdl }, measures] = await monitoredReduce({
    funcs: normalizers,
    initialInput,
    category: 'normalize',
    mapResponse: idl => ({ serverOpts, idl }),
  });

  return [newIdl, measures];
};

module.exports = {
  normalizeIdl,
};
