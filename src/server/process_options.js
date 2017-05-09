'use strict';


const { getIdl } = require('../idl');
const { validate } = require('../validation');


const processOptions = async function (options) {
  options = applyDefaultOptions({ options });

  const idl = await getIdl({ conf: options.conf });
  Object.assign(options, { idl });

  return options;
};

// Default value for main options
const applyDefaultOptions = function ({ options }) {
  return Object.assign({}, defaultOptions, options);
};
const defaultOptions = {
  maxDataLength: 1000,
};


module.exports = {
  processOptions,
};
