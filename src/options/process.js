'use strict';

const { cloneDeep } = require('lodash');

const { makeImmutable } = require('../utilities');

const { applyDefaultOptions } = require('./default');
const { transformOptions } = require('./transform');
const { validateOptions } = require('./validate');

const processors = [
  applyDefaultOptions,
  transformOptions,
  validateOptions,
];

const processOptions = function ({ options, startupLog }) {
  const optionsPerf = startupLog.perf.start('options');

  const copiedOpts = cloneDeep(options);

  const finalServerOpts = processors.reduce((serverOpts, processor) => {
    const perf = startupLog.perf.start(processor.name, 'options');
    const newServerOpts = processor({ serverOpts });
    perf.stop();
    return newServerOpts;
  }, copiedOpts);

  makeImmutable(finalServerOpts);

  optionsPerf.stop();
  return finalServerOpts;
};

module.exports = {
  processOptions,
};
