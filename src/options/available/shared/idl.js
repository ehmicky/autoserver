'use strict';

// `run` and `compile` option `idl`
const idl = {
  name: 'idl',
  description: 'File containing the data model and business logic',
  subConfFiles: [{
    filename: 'idl',
    extNames: ['compiled.json', 'json', 'yml', 'yaml'],
  }],
  validate: {
    type: 'string',
    required: true,
  },
};

module.exports = {
  idl,
};
