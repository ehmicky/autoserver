'use strict';

const { KINDS } = require('../../../constants');

const db = [
  {
    name: 'db',
    description: 'List of databases',
    default: [{
      type: 'memory',
    }],
    group: 'Databases:',
    validate: {
      type: 'object[]',
    },
  },

  {
    name: 'db.type',
    default: 'memory',
    description: 'Database type',
    group: 'Databases:',
    validate: {
      type: 'string',
      enum: ['memory'],
    },
  },

  {
    name: 'db.models',
    description: 'Models using this database',
    group: 'Databases:',
    validate: {
      type: 'string[]',
    },
  },

  {
    name: 'db.kinds',
    description: 'Models with this kind will use this database',
    group: 'Databases:',
    validate: {
      type: 'string[]',
      enum: KINDS,
    },
  },
];

module.exports = db;
