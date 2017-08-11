'use strict';

const { monitoredReduce } = require('../perf');

const { loadRuntimeOptsFile } = require('./load');
const { resolveEventsOptsFile } = require('./resolve_events');
const { applyDefaultRuntimeOpts } = require('./default');
const { loadEventsOptsFile } = require('./load_events');
const { validateRuntimeOpts } = require('./validate');

const processors = [
  loadRuntimeOptsFile,
  resolveEventsOptsFile,
  applyDefaultRuntimeOpts,
  loadEventsOptsFile,
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
