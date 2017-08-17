'use strict';

const { idlReducer } = require('../reducer');

const { normalizeHelpers } = require('./helpers');
const { normalizeAllModels } = require('./models');
const { normalizeGraphQL } = require('./graphql');
const { normalizeShortcuts } = require('./shortcuts');
const { addInlineFuncPaths } = require('./inline_func_paths');

const normalizers = [
  normalizeHelpers,
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
