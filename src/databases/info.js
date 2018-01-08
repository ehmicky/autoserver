'use strict';

const { mapValues } = require('../utilities');

const { databaseAdapters } = require('./merger');

// Retrieves database options
const getOpts = function () {
  return mapValues(databaseAdapters, ({ opts = {} }) => opts);
};

const DATABASE_OPTS = getOpts();

// Retrieves database defaults
const getDefaults = function () {
  return mapValues(databaseAdapters, ({ defaults = {} }) => defaults);
};

const DATABASE_DEFAULTS = getDefaults();

const databaseExists = function ({ database }) {
  return databaseAdapters[database] !== undefined;
};

// Retrieves database features
const getFeatures = function ({ database }) {
  const { features } = databaseAdapters[database];
  return features;
};

module.exports = {
  DATABASE_OPTS,
  DATABASE_DEFAULTS,
  databaseExists,
  getFeatures,
};
