'use strict';


const { applyDefaultOptions } = require('./default');
const { transformOptions } = require('./transform');
const { validateOptions } = require('./validate');


const processOptions = async function (options) {
  const perf = options.startupLog.perf.start('options');

  options = applyDefaultOptions({ options });

  transformOptions({ options });

  validateOptions({ options });

  perf.stop();
  return options;
};


module.exports = {
  processOptions,
};
