'use strict';


const { each } = require('lodash');


// Like lodash mapValues(), but recursive and by reference
const recurseMap = function ({ value, mapFunc }) {
  const cache = new WeakMap();
  const root = value;

  const recurse = function ({ value, key, parent, depth }) {
    // Avoids infinite recursions
    const originalValue = value;
    if (cache.has(originalValue)) { return cache.get(originalValue); }

    value = mapFunc({ value, key, parent, root, depth });

    if (value && typeof value === 'object') {
      cache.set(originalValue, value);
    }

    // If return value contains __noRecurse, stop here,
    // to avoid infinite recursion when recursive value was added by deep copy
    if (value && value.__noRecurse) {
      delete value.__noRecurse;
      return value;
    }

    ++depth;
    if (value && (value.constructor === Object || value instanceof Array)) {
      each(value, (child, childKey) => {
        value[childKey] = recurse({ value: child, key: childKey, parent: value, depth });
      });
    }

    return value;
  };

  return recurse({ value, key: null, parent: null, depth: 0 });
};


module.exports = {
  recurseMap,
};
