'use strict';

// `run` option `idl`
const idl = {
  name: 'idl',
  description: 'File containing the data model and business logic',
  subConfFiles: [{
    filename: 'idl',
    extNames: ['compiled.json', 'json', 'yml', 'yaml'],
    instruction: 'run',
  }],
  validate: {
    type: 'string',
    required: true,
  },
};

// `compile` option `idl`
const uncompiledIdl = {
  ...idl,
  subConfFiles: [{
    ...idl.subConfFiles[0],
    extNames: ['json', 'yml', 'yaml'],
  }],
};

module.exports = {
  idl,
  uncompiledIdl,
};
