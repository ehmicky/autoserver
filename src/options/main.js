'use strict';

const { monitoredReduce } = require('../perf');

const { availableInstructions } = require('./available');
const { loadMainConf } = require('./main_conf');
const { applyEnvVars } = require('./env');
const { loadSubConf } = require('./sub_conf');
const { applyDefaultOptions } = require('./default');
const { validateOptions } = require('./validate');

const processors = [
  loadMainConf,
  applyEnvVars,
  applyDefaultOptions,
  loadSubConf,
  validateOptions,
];

// Retrieve and validate main options
const getOptions = function ({ instruction, options }) {
  const { options: availableOpts } = availableInstructions
    .find(({ name }) => name === instruction);
  return monitoredReduce({
    funcs: processors,
    initialInput: { options, instruction, availableOpts },
    mapResponse: (newInput, input) => ({ ...input, ...newInput }),
    category: `${instruction}_opts`,
  });
};

module.exports = {
  getOptions,
};
