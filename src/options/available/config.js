'use strict';

// Runtime option `config`, shared by all commands
const config = {
  name: 'config',
  description: 'Configuration file',
  validate: { type: 'object' },
};

module.exports = [
  config,
];
