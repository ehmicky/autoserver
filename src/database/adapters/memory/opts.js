'use strict';

const { generic } = require('../../../formats');

const opts = [{
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
}];

module.exports = {
  opts,
};
