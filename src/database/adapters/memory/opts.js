'use strict';

const { extNames, description } = require('../../../formats');

const opts = [
  {
    name: 'data',
    description: `File containing the data (${description})`,
    subConfFiles: [{
      filename: 'db.memory',
      extNames,
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
    default: true,
    validate: {
      type: 'boolean',
    },
  },
];

module.exports = {
  opts,
};
