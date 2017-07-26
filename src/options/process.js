'use strict';

const { cloneDeep } = require('lodash');

const { makeImmutable } = require('../utilities');
const { monitoredReduce } = require('../perf');

const { applyDefaultOptions } = require('./default');
const { transformOptions } = require('./transform');
const { validateOptions } = require('./validate');

const processors = [
  applyDefaultOptions,
  transformOptions,
  validateOptions,
];

const processOptions = async function ({ options }) {
  const copiedOpts = cloneDeep(options);

  const [finalServerOpts, measures] = await monitoredReduce({
    funcs: processors,
    initialInput: copiedOpts,
    category: 'options',
  });

  makeImmutable(finalServerOpts);

  return [{ serverOpts: finalServerOpts }, measures];
};

module.exports = {
  processOptions,
};
