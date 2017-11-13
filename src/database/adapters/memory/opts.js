'use strict';

const { getExtNames, getDescription } = require('../../../formats');

const opts = [
  {
    name: 'data',
    description: `File containing the data (${getDescription('db')})`,
    subConfFiles: [{
      filename: 'db.memory',
      extNames: getExtNames('db'),
      loader: 'db',
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
