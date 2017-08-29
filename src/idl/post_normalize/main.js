'use strict';

const { idlReducer } = require('../reducer');

const { normalizeAllModels } = require('./models');
const { normalizeGraphQL } = require('./graphql');
const { normalizeShortcuts } = require('./shortcuts');
const { addInlineFuncPaths } = require('./inline_func_paths');

const normalizers = [
  normalizeAllModels,
  normalizeGraphQL,
  normalizeShortcuts,
  addInlineFuncPaths,
];

// Normalize IDL definition
const postNormalizeIdl = idlReducer.bind(null, normalizers);

module.exports = {
  postNormalizeIdl,
};
