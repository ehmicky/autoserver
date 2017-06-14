'use strict';


const { applyDefaultOptions } = require('./default');
const { transformOptions } = require('./transform');
const { validateOptions } = require('./validate');


const processOptions = async function ({
  serverOpts,
  serverOpts: { startupLog },
}) {
  const perf = startupLog.perf.start('options');

  serverOpts = applyDefaultOptions({ serverOpts });

  transformOptions({ serverOpts });

  validateOptions({ serverOpts });

  perf.stop();
  return serverOpts;
};


module.exports = {
  processOptions,
};
