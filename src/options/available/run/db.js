'use strict';

const db = [
  {
    name: 'db',
    description: 'List of available databases',
    group: 'Databases',
    validate: {
      type: 'object',
    },
  },

  {
    name: 'db.memory',
    description: 'In-memory database. For development purpose only.',
    group: 'Databases (In-memory)',
    validate: {
      type: 'object',
    },
  },

  {
    name: 'db.memory.models',
    description: 'Models using this database.\nCan either be the \'model\' name or the models kind as \'kind:...\'',
    group: 'Databases (In-memory)',
    validate: {
      type: 'string[]',
    },
  },
];

module.exports = db;
