'use strict';

// Runtime option `idl`
const idl = {
  name: 'idl',
  description: 'File containing the data model and business logic',
  subConfFiles: [{
    filename: 'idl',
    extNames: ['json', 'yml', 'yaml'],
    loader: 'jsonRef',
  }],
  validate: {
    type: 'object',
    required: true,
  },
};

module.exports = [
  idl,
];
