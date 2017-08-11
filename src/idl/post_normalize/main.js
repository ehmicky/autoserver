'use strict';

const { idlReducer } = require('../reducer');

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
const postNormalizeIdl = idlReducer.bind(null, normalizers);

module.exports = {
  postNormalizeIdl,
};
