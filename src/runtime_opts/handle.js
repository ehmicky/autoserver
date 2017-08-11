'use strict';

const { monitoredReduce } = require('../perf');

const { loadRuntimeOptsFile } = require('./load');
const { applyDefaultRuntimeOpts } = require('./default');
const { validateRuntimeOpts } = require('./validate');

const processors = [
  loadRuntimeOptsFile,
  applyDefaultRuntimeOpts,
  validateRuntimeOpts,
];

// Retrieve and validate `runtimeOpts`
const getRuntimeOpts = function ({ runtimeOptsFile }) {
  return monitoredReduce({
    funcs: processors,
    initialInput: { runtimeOptsFile },
    category: 'runtime_opts',
  });
};

module.exports = {
  getRuntimeOpts,
};
