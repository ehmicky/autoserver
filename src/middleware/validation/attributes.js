'use strict';


const { merge, chain } = require('lodash');

const { EngineError } = require('../../error');


/**
 * Transform arguments into model attributes to validate
 * E.g. args: { filters: { a: 1 }, data: [{ b: 2 }, {c: 5}], ids: [4,5] } would be transformed to:
 * [
 *   { a: 1, id: 4, argName: 'filters' },
 *   { a: 1, id: 5, argName: 'filters' },
 *   { b: 2, id: 4, argName: 'data' },
 *   { c: 5, id: 5, argName: 'data' },
 * ]
 **/
const getAttributes = function (args) {
  const { id, ids } = args;
  // Is either `id` or `ids` specified
  const hasIds = id || (ids && ids.length > 0);
  // If only `id` or `ids` is specified, transform to a `filters` with only `id` in it
  if (hasIds && !args.filters && !args.data) {
    args.filters = {};
  }
  // Iterate over args.filters and args.data
  return chain(args)
    .pickBy((arg, argName) => ['filters', 'data'].includes(argName) && arg)
    .map((arg, argName) => {
      if (ids) {
        // If `ids` is specified and `data` is an array, they must have same length
        if (arg instanceof Array) {
          if (arg.length !== ids.length) {
            throw new EngineError(`'${argName}' array length must match 'ids' array length`, { reason: 'INPUT_VALIDATION' });
          }
        // If `ids` is specified and `filters` or `data` is not an array, transform to an array of the same size
        } else {
          arg = Array(ids.length).fill(merge({}, arg));
        }
      }

      // Convenience for the next statements
      arg = arg instanceof Array ? arg : [arg];
      // Add `id` (from `id` or `ids` argument) to the `filters` and `data` objects
      if (hasIds) {
        arg = arg.map((singleArg, index) => Object.assign({}, singleArg, { id: id || ids[index] }));
      }
      // Add argument name (e.g. `filters` or `data`) so it can be used in errors messages
      arg = arg.map(attrs => Object.assign({}, { attrs }, { argName }));
      return arg;
    })
    .flatten()
    .value();
};


module.exports = {
  getAttributes,
};
