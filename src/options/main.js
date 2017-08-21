'use strict';

const { monitoredReduce } = require('../perf');

const availableOptions = require('./available');
const { loadOptionsConfig } = require('./load');
const { applyDefaultOptions } = require('./default');
const { loadSubConfPaths } = require('./sub_conf');
const { validateOptions } = require('./validate');

const processors = [
  loadOptionsConfig,
  applyDefaultOptions,
  loadSubConfPaths,
  validateOptions,
];

// Retrieve and validate main options
const getOptions = function ({ config, command }) {
  const availableOpts = availableOptions.find(({ name }) => name === command);
  return monitoredReduce({
    funcs: processors,
    initialInput: { config, command, availableOpts },
    mapResponse: (newInput, input) => ({ ...input, ...newInput }),
    category: `${command}_opts`,
  });
};

module.exports = {
  getOptions,
};
