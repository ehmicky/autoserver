'use strict';

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
    description: 'Models using this database.\nCan either be the \'model\' name or the models kind as \'kind:...\'',
    group: 'Databases:',
    validate: {
      type: 'string[]',
    },
  },
];

module.exports = db;
