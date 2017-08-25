'use strict';

const { getRequestHandler } = require('../middleware');
const { monitoredReduce } = require('../perf');
const { getHelpers, compileIdlFuncs } = require('../idl_func');
const { getServerInfo } = require('../server_info');

const { launchServers } = require('./launch');

// Boot each server
const bootServers = async function ({ runOpts, runOpts: { idl }, measures }) {
  const { servers, idl: idlA } = await monitoredReduce({
    funcs: processors,
    initialInput: { runOpts, idl, measures },
    mapResponse: (input, newInput) => ({ ...input, ...newInput }),
    category: 'boot',
  });
  return { servers, idl: idlA };
};

const processors = [
  compileIdlFuncs,
  getHelpers,
  getServerInfo,
  getRequestHandler,
  launchServers,
];

module.exports = {
  bootServers,
};
