'use strict';

const { monitoredReduce } = require('../../perf');
const { getHelpers, compileIdlFuncs } = require('../../idl_func');

const { compileJsonSchema } = require('./json_schema');

// Parse IDL file
const parseIdl = function ({ runOpts, runOpts: { idl }, measures }) {
  return monitoredReduce({
    funcs: processors,
    initialInput: { runOpts, idl, measures },
    mapResponse: (input, newInput) => ({ ...input, ...newInput }),
    category: 'idl',
  });
};

const processors = [
  compileIdlFuncs,
  getHelpers,
  compileJsonSchema,
];

module.exports = {
  parseIdl,
};
