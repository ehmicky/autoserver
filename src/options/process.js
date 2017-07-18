'use strict';

const { cloneDeep } = require('lodash');

const { makeImmutable } = require('../utilities');

const { applyDefaultOptions } = require('./default');
const { transformOptions } = require('./transform');
const { validateOptions } = require('./validate');

const processOptions = function ({ options, startupLog }) {
  const perf = startupLog.perf.start('options');

  const copiedOpts = cloneDeep(options);

  const defaultedOpts = applyDefaultOptions({
    serverOpts: copiedOpts,
    startupLog,
  });

  const serverOpts = transformOptions({
    serverOpts: defaultedOpts,
    startupLog,
  });

  validateOptions({ serverOpts, startupLog });

  makeImmutable(serverOpts);

  perf.stop();
  return serverOpts;
};

module.exports = {
  processOptions,
};
