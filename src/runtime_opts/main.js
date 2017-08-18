'use strict';

const { monitoredReduce } = require('../perf');

const { loadRuntimeOptsFile } = require('./load');
const { applyDefaultRuntimeOpts } = require('./default');
const { loadEventsOptsFile } = require('./events');
const { validateRuntimeOpts } = require('./validate');

const processors = [
  loadRuntimeOptsFile,
  applyDefaultRuntimeOpts,
  loadEventsOptsFile,
  validateRuntimeOpts,
];

// Retrieve and validate `runtimeOpts`
const getRuntimeOpts = function ({ runtime }) {
  return monitoredReduce({
    funcs: processors,
    initialInput: { runtime },
    category: 'runtime_opts',
  });
};

module.exports = {
  getRuntimeOpts,
};
