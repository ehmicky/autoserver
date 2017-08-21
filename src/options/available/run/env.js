'use strict';

// `run` option `env`
const env = {
  name: 'env',
  default: 'production',
  description: 'Environment in which the server is run',
  validate: {
    type: 'string',
    enum: ['dev', 'production'],
  },
};

module.exports = [
  env,
];
