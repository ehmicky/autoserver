'use strict';


const { getIdl } = require('../idl');
const { applyDefaultOptions } = require('./default');
const { transformOptions } = require('./transform');
const { validateOptions } = require('./validate');


const processOptions = async function (options) {
  const perf = options.startupLog.perf.start('options');

  options = applyDefaultOptions({ options });

  transformOptions({ options });

  validateOptions({ options });

  perf.stop();
  const idlPerf = options.startupLog.perf.start('idl');

  const idl = await getIdl({ conf: options.conf });
  Object.assign(options, { idl });

  idlPerf.stop();

  return options;
};


module.exports = {
  processOptions,
};
