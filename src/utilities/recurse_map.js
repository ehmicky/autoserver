'use strict';


const { mapValues, map } = require('lodash');


// Like lodash mapValues(), but recursive, avoiding infinite recursion
const recurseMap = function ({ value, mapFunc, filterFunc }) {
  let cache = [];
  const root = value;
  const recurse = function ({ value, key, parent, depth }) {
    const isKept = !filterFunc || filterFunc({ value, key, parent, root, depth });
    if (!isKept) { return value; }

    value = mapFunc({ value, key, parent, root, depth });
    // If return value contains __noRecurse, stop here,
    // to avoid infinite recursion when recursive value was added by deep copy
    if (value && value.__noRecurse) {
      delete value.__noRecurse;
      return value;
    }

    depth++;
    const isObject = value && value.constructor === Object;
    const isArray = value && value instanceof Array;
    if (isObject || isArray) {
      if (cache.includes(value)) { return value; }
      cache.push(value);
      const mapper = isObject ? mapValues : map;
      value = mapper(value, (child, childKey) => recurse({ value: child, key: childKey, parent: value, depth }));
    }

    return value;
  };
  return recurse({ value, key: null, parent: null, depth: 0 });
};


module.exports = {
  recurseMap,
};
