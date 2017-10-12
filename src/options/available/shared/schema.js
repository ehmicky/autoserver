'use strict';

const { genericExtNames } = require('../../../utilities');

// `run` option `schema`
const schema = {
  name: 'schema',
  description: 'File containing the data model and business logic',
  subConfFiles: [{
    filename: 'schema',
    extNames: ['compiled.json', ...genericExtNames],
    instruction: 'run',
  }],
  validate: {
    type: 'string',
    required: true,
  },
};

// `compile` option `schema`
const uncompiledSchema = {
  ...schema,
  subConfFiles: [{
    ...schema.subConfFiles[0],
    extNames: genericExtNames,
  }],
};

module.exports = {
  schema,
  uncompiledSchema,
};
