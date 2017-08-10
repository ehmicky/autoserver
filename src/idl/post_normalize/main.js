'use strict';

const { reduceAsync } = require('../../utilities');

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
  return reduceAsync(normalizers, (idlA, func) => func({ idl: idlA }), idl);
};

module.exports = {
  postNormalizeIdl,
};
