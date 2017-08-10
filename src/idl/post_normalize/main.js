'use strict';

const { monitoredReduce } = require('../../perf');

const { normalizeHelpers } = require('./helpers');
const { normalizeAllModels } = require('./models');
const { normalizeGraphQL } = require('./graphql');
const { normalizeShortcuts } = require('./shortcuts');

const normalizers = [
  normalizeHelpers,
  normalizeAllModels,
  normalizeGraphQL,
  normalizeShortcuts,
];

// Normalize IDL definition
const postNormalizeIdl = function ({ idl }) {
  return monitoredReduce({
    funcs: normalizers,
    initialInput: idl,
    category: 'post_normalize',
    mapInput: idlA => ({ idl: idlA }),
  });
};

module.exports = {
  postNormalizeIdl,
};
