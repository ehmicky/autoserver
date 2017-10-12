'use strict';

const { generic } = require('../../../formats');

const opts = [
  {
    name: 'data',
    description: `File containing the data (${generic.description})`,
    subConfFiles: [{
      filename: 'db.memory',
      extNames: generic.extNames,
      loader: 'generic',
      keepPath: true,
    }],
    validate: {
      type: 'object',
    },
  },

  {
    name: 'save',
    description: 'Saves the data when the server shuts down',
    validate: {
      type: 'boolean',
    },
  },
];

module.exports = {
  opts,
};
