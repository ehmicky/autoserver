'use strict';

const { genericExtNames, genericDescription } = require('../../../utilities');

const opts = [{
  name: 'data',
  description: `File containing the data (${genericDescription})`,
  subConfFiles: [{
    filename: 'db.memory',
    extNames: genericExtNames,
    loader: 'generic',
    keepPath: true,
  }],
  validate: {
    type: 'object',
  },
}];

module.exports = {
  opts,
};
