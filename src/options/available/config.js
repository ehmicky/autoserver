'use strict';

// Option `config`, shared by all commands
const config = {
  name: 'config',
  description: 'Configuration file',
  validate: { type: 'object' },
};

module.exports = [
  config,
];
