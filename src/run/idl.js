'use strict';

const { monitoredReduce } = require('../perf');
const { compileIdlFuncs, getHelpers } = require('../idl_func');
const { loadIdl, compileJsonSchema, buildGraphQLSchema } = require('../idl');

// Parse IDL file
const parseIdl = function ({ runOpts, measures }) {
  return monitoredReduce({
    funcs: processors,
    initialInput: { runOpts, measures },
    mapResponse: (input, newInput) => ({ ...input, ...newInput }),
    category: 'idl',
  });
};

const processors = [
  loadIdl,
  compileIdlFuncs,
  getHelpers,
  compileJsonSchema,
  buildGraphQLSchema,
];

module.exports = {
  parseIdl,
};
