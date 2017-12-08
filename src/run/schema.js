'use strict';

const { monitoredReduce } = require('../perf');
const { loadSchema } = require('../schema');

// Parse schema
const parseSchema = function ({ runOpts, measures }) {
  return monitoredReduce({
    funcs: [loadSchema],
    initialInput: { runOpts, measures },
    mapResponse: (input, newInput) => ({ ...input, ...newInput }),
    category: 'schema',
  });
};

module.exports = {
  parseSchema,
};
