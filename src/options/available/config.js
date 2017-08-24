'use strict';

// Option `config`, shared by all instructions
const config = {
  name: 'config',
  description: 'Configuration file (YAML or JSON)',
  validate: { type: 'string' },
};

module.exports = [
  config,
];
