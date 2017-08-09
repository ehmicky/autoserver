'use strict';

const { monitoredReduce } = require('../../perf');

const { applyDefaultOptions } = require('./default');
const { validateOptions } = require('./validate');

const processors = [
  applyDefaultOptions,
  validateOptions,
];

const getServerOpts = function (oServerOpts) {
  return monitoredReduce({
    funcs: processors,
    initialInput: oServerOpts,
    category: 'options',
  });
};

module.exports = {
  getServerOpts,
};
