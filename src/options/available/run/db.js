'use strict';

const { getAdaptersOpts } = require('./db_adapters');

const db = [
  {
    name: 'db',
    description: 'List of available databases',
    group: 'Databases',
    default: {
      memory: { enabled: true },
    },
    validate: {
      type: 'object',
    },
  },

  ...getAdaptersOpts(),
];

module.exports = db;
