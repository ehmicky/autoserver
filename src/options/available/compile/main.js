'use strict';

const { config, uncompiledSchema } = require('../shared');

const instruction = require('./instruction');

const options = [
  config,

  uncompiledSchema,
];

module.exports = {
  ...instruction,
  options,
};
