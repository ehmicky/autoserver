'use strict';


const { cloneDeep } = require('lodash');

const { makeImmutable } = require('../utilities');
const { applyDefaultOptions } = require('./default');
const { transformOptions } = require('./transform');
const { validateOptions } = require('./validate');


const processOptions = async function ({
  options,
  serverState,
  serverState: { startupLog },
}) {
  const perf = startupLog.perf.start('options');

  let serverOpts = cloneDeep(options);

  serverOpts = applyDefaultOptions({ serverOpts, serverState });

  serverOpts = transformOptions({ serverOpts, serverState });

  validateOptions({ serverOpts, serverState });

  makeImmutable(serverOpts);

  perf.stop();
  return serverOpts;
};


module.exports = {
  processOptions,
};
