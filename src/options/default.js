'use strict';


const { defaultsDeep } = require('lodash');


// Default value for main options
const applyDefaultOptions = function ({
  serverOpts,
  serverOpts: { startupLog },
}) {
  const perf = startupLog.perf.start('default', 'options');
  const newOptions = defaultsDeep(serverOpts, defaultOptions);
  perf.stop();
  return newOptions;
};

const defaultOptions = {
  maxDataLength: 1000,
  defaultPageSize: 100,
  maxPageSize: 100,
  loggerLevel: 'info',
  loggerFilter: {
    payload: ['id'],
    response: ['id'],
    argData: ['id'],
    actionResponses: ['id'],
    headers: [],
    queryVars: [],
    params: [],
    settings: [],
  },
};


module.exports = {
  applyDefaultOptions,
};
