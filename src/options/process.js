'use strict';


const { applyDefaultOptions } = require('./default');
const { transformOptions } = require('./transform');
const { validateOptions } = require('./validate');


const processOptions = async function ({
  serverOpts,
  serverState,
  serverState: { startupLog },
}) {
  const perf = startupLog.perf.start('options');

  serverOpts = applyDefaultOptions({ serverOpts, serverState });

  transformOptions({ serverOpts, serverState });

  validateOptions({ serverOpts, serverState });

  perf.stop();
  return serverOpts;
};


module.exports = {
  processOptions,
};
