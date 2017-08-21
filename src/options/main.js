'use strict';

const { monitoredReduce } = require('../perf');

const { availableCommands } = require('./available');
const { loadMainConf } = require('./main_conf');
const { applyDefaultOptions } = require('./default');
const { loadSubConf } = require('./sub_conf');
const { validateOptions } = require('./validate');

const processors = [
  loadMainConf,
  applyDefaultOptions,
  loadSubConf,
  validateOptions,
];

// Retrieve and validate main options
const getOptions = function ({ command, options }) {
  const { options: availableOpts } = availableCommands
    .find(({ name }) => name === command);
  return monitoredReduce({
    funcs: processors,
    initialInput: { options, command, availableOpts },
    mapResponse: (newInput, input) => ({ ...input, ...newInput }),
    category: `${command}_opts`,
  });
};

module.exports = {
  getOptions,
};
