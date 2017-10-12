'use strict';

const { genericDescription } = require('../../../utilities');

const config = {
  name: 'config',
  description: `Configuration file (${genericDescription})`,
  validate: {
    type: 'string',
  },
};

module.exports = {
  config,
};
