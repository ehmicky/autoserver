'use strict';

const { deepMerge, mapValues } = require('../../utilities');
const { protocolAdapters } = require('../../protocols');
const { databaseAdapters, DEFAULT_DATABASE } = require('../../database');
const { mapColls, mapAttrs } = require('../helpers');

// Add config default values
const addDefaults = function ({ config }) {
  const configA = addTopDefaults({ config });
  const configB = addCollsDefaults({ config: configA });
  const configC = addAttrsDefaults({ config: configB });
  return configC;
};

// Top-level defaults
const addTopDefaults = function ({ config }) {
  const dynamicDefaults = mapValues(DYNAMIC_DEFAULTS, getDynamicDefaults);
  const configA = deepMerge(TOP_DEFAULT_VALUES, dynamicDefaults, config);
  return configA;
};

// Defaults related to adapters
const getDynamicDefaults = function (adapters) {
  return mapValues(adapters, ({ defaults = {} }) => defaults);
};

// Collection-level defaults
const addCollsDefaults = function ({ config }) {
  const configA = mapColls(addCollDefaults, { config });
  return { ...config, ...configA };
};

const addCollDefaults = function ({ coll }) {
  return deepMerge(COLL_DEFAULTS, coll);
};

// Attribute-level defaults
const addAttrsDefaults = function ({ config }) {
  const configA = mapAttrs(addAttrDefaults, { config });
  return { ...config, ...configA };
};

const addAttrDefaults = function ({ attr }) {
  return deepMerge(ATTR_DEFAULTS, attr);
};

const TOP_DEFAULT_VALUES = {
  env: 'dev',
  collections: {},
  params: {},
  operators: {},
  log: [],
  limits: {
    maxpayload: '10MB',
    pagesize: 100,
  },
};

const DYNAMIC_DEFAULTS = {
  databases: databaseAdapters,
  protocols: protocolAdapters,
};

const COLL_DEFAULTS = {
  database: DEFAULT_DATABASE.name,
  attributes: {
    id: { description: 'Unique identifier' },
  },
};

const ATTR_DEFAULTS = {
  type: 'string',
  validate: {},
};

module.exports = {
  addDefaults,
};
