'use strict';

// Option `config`, shared by all commands
const config = {
  name: 'config',
  description: 'Configuration file (YAML or JSON)',
  validate: { type: 'string' },
};

module.exports = [
  config,
];
