'use strict';

const { cloneDeep } = require('lodash');

const { monitoredReduce } = require('../perf');

const { applyDefaultOptions } = require('./default');
const { transformOptions } = require('./transform');
const { validateOptions } = require('./validate');

const processors = [
  applyDefaultOptions,
  transformOptions,
  validateOptions,
];

const processOptions = function ({ options }) {
  return monitoredReduce({
    funcs: processors,
    initialInput: { serverOpts: cloneDeep(options) },
    category: 'options',
    mapInput: ({ serverOpts }) => serverOpts,
    mapResponse: serverOpts => ({ serverOpts }),
  });
};

module.exports = {
  processOptions,
};
