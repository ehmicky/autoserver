'use strict';

const { omit } = require('../utilities');
const { monitoredReduce } = require('../perf');

const { availableInstructions } = require('./available');
const { loadMainConf } = require('./main_conf');
const { setFlatOpts } = require('./flat_opts');
const { applyEnvVars } = require('./env');
const { loadSubConf } = require('./sub_conf');
const { applyDefaultOptions } = require('./default');
const { validateOptions } = require('./validate');

const processors = [
  loadMainConf,
  setFlatOpts,
  applyEnvVars,
  applyDefaultOptions,
  loadSubConf,
  validateOptions,
];

// Retrieve and validate main options
const getOptions = function ({ instruction, options, measures = [] }) {
  const optionsA = omit(options, 'measures');
  const availableOpts = getAvailableOpts({ instruction });
  return monitoredReduce({
    funcs: processors,
    initialInput: { options: optionsA, instruction, availableOpts, measures },
    mapResponse: (input, newInput) => ({ ...input, ...newInput }),
    category: `${instruction}_opts`,
  });
};

const getAvailableOpts = function ({ instruction }) {
  const { options: availableOpts } = availableInstructions
    .find(({ name }) => name === instruction);
  return availableOpts;
};

module.exports = {
  getOptions,
};
