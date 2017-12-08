'use strict';

const { monitoredReduce } = require('../perf');
const { loadSchema, rpcStartServer } = require('../schema');

// Parse schema
const parseSchema = function ({ runOpts, measures }) {
  return monitoredReduce({
    funcs: processors,
    initialInput: { runOpts, measures },
    mapResponse: (input, newInput) => ({ ...input, ...newInput }),
    category: 'schema',
  });
};

const processors = [
  loadSchema,
  rpcStartServer,
];

module.exports = {
  parseSchema,
};
