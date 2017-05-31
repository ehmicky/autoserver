'use strict';


// Default value for main options
const applyDefaultOptions = function ({ options }) {
  return Object.assign({}, defaultOptions, options);
};

const defaultOptions = {
  projectName: 'api_engine',

  maxDataLength: 1000,
  defaultPageSize: 100,
  maxPageSize: 100,
  loggerLevel: 'info',
};


module.exports = {
  applyDefaultOptions,
};
