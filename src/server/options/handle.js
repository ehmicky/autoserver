'use strict';

const { monitoredReduce } = require('../../perf');

const { loadServerOptsFile } = require('./load');
const { applyDefaultOptions } = require('./default');
const { validateOptions } = require('./validate');

const processors = [
  loadServerOptsFile,
  applyDefaultOptions,
  validateOptions,
];

// Retrieve and validate `serverOpts`
const getServerOpts = function ({ serverOptsFile }) {
  return monitoredReduce({
    funcs: processors,
    initialInput: { serverOptsFile },
    category: 'options',
  });
};

module.exports = {
  getServerOpts,
};
