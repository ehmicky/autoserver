'use strict';

const { getExtNames } = require('../../../formats');

// `run` option `schema`
const schema = {
  name: 'schema',
  description: 'File containing the data model and business logic',
  subConfFiles: [{
    filename: 'schema',
    extNames: ['compiled.json', ...getExtNames('conf')],
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
    extNames: getExtNames('conf'),
  }],
};

module.exports = {
  schema,
  uncompiledSchema,
};
