'use strict';

const { getExtNames } = require('../../../formats');

// `run` option `schema`
const schema = {
  name: 'schema',
  description: 'File containing the data model and business logic',
  subConfFiles: [{
    filename: 'schema',
    extNames: getExtNames('conf'),
    instruction: 'run',
  }],
  validate: {
    type: 'string',
    required: true,
  },
};

module.exports = {
  schema,
};
