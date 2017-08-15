'use strict';

// Runtime option `env`
const env = {
  name: 'env',
  validate: {
    type: 'string',
    enum: ['dev', 'production'],
  },
};

module.exports = [
  env,
];
