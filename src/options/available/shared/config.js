'use strict';

const { getDescription } = require('../../../formats');

const config = {
  name: 'config',
  description: `Configuration file (${getDescription('conf')})`,
  validate: {
    type: 'string',
  },
};

module.exports = {
  config,
};
