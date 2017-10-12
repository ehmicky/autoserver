'use strict';

const { generic } = require('../../../formats');

// `run` option `schema`
const schema = {
  name: 'schema',
  description: 'File containing the data model and business logic',
  subConfFiles: [{
    filename: 'schema',
    extNames: ['compiled.json', ...generic.extNames],
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
    extNames: generic.extNames,
  }],
};

module.exports = {
  schema,
  uncompiledSchema,
};
