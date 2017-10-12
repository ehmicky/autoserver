'use strict';

const { generic } = require('../../../formats');

const config = {
  name: 'config',
  description: `Configuration file (${generic.description})`,
  validate: {
    type: 'string',
  },
};

module.exports = {
  config,
};
