'use strict';

const { cloneDeep } = require('lodash');

const { makeImmutable } = require('../utilities');
const { applyDefaultOptions } = require('./default');
const { transformOptions } = require('./transform');
const { validateOptions } = require('./validate');

const processOptions = async function ({ options, startupLog }) {
  const perf = startupLog.perf.start('options');

  let serverOpts = cloneDeep(options);

  serverOpts = applyDefaultOptions({ serverOpts, startupLog });

  serverOpts = transformOptions({ serverOpts, startupLog });

  validateOptions({ serverOpts, startupLog });

  makeImmutable(serverOpts);

  perf.stop();
  return serverOpts;
};

module.exports = {
  processOptions,
};
