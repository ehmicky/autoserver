'use strict';


const { chain } = require('lodash');


/**
 * Transform arguments into model attributes to validate
 * E.g. args: { filters: { a: 1 }, input: { b: 2 }, id: 3, ids: [4,5] } would be transformed to:
 * [
 *   { a: 1, argName: 'filters' },
 *   { b: 2, argName: 'input' },
 *   { id: 3, argName: 'id' },
 *   { id: 4, argName: 'ids' },
 *   { id: 5, argName: 'ids' },
 * ]
 **/
const getAttributes = function (args) {
  return chain(args)
    .mapValues((value, argName) => {
      const normalizer = normalizeAttributes[argName];
      if (!normalizer) { return; }
      // Add argument name (e.g. `filters` or `data`) so it can be used in errors messages
      return normalizer(value).map(attrs => ({ attrs, argName }));
    })
    .values()
    .flattenDeep()
    .compact()
    .value();
};

const normalizeAttributes = {
  data: data => data instanceof Array ? data : [data],
  filters: filters => [filters],
  ids: ids => ids.map(id => ({ id })),
  id: id => [{ id }],
};


module.exports = {
  getAttributes,
};
