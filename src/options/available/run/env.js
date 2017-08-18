'use strict';

// Runtime option `env`
const env = {
  name: 'env',
  default: 'production',
  validate: {
    type: 'string',
    enum: ['dev', 'production'],
  },
};

module.exports = [
  env,
];
