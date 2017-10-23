'use strict';

const { databaseAdapters } = require('../../../database');

const { getDynamicOpts } = require('./dynamic');

// Options shared by all database adapters
const commonOpts = [
  {
    name: 'models',
    description: 'Names of the models using this database.\nCan be \'...\' to target \'all the other models\'',
    validate: {
      type: 'string[]',
      unique: true,
    },
  },
];

const db = getDynamicOpts({
  name: 'db',
  title: 'Database',
  handlers: databaseAdapters,
  commonOpts,
});

module.exports = db;
