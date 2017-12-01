'use strict';

const { monitoredReduce } = require('../perf');
const { compileInlineFuncs, getUserVars } = require('../schema_func');
const {
  loadSchema,
  compileJsonSchema,
  normalizePatchOperators,
  rpcStartServer,
} = require('../schema');

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
  compileInlineFuncs,
  getUserVars,
  compileJsonSchema,
  normalizePatchOperators,
  rpcStartServer,
];

module.exports = {
  parseSchema,
};
