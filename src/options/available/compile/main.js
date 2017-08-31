'use strict';

const { config, uncompiledIdl } = require('../shared');

const instruction = require('./instruction');

const options = [
  config,

  uncompiledIdl,
];

module.exports = {
  ...instruction,
  options,
};
