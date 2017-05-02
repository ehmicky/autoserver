'use strict';


const { each } = require('lodash');


// Like lodash mapValues(), but recursive and by reference
const recurseMapByRef = function ({ value, mapFunc }) {
  const cache = new WeakMap();

  const recurse = function ({ value, key, parent, parents, depth }) {
    // Avoids infinite recursions
    const originalValue = value;
    if (cache.has(originalValue)) { return cache.get(originalValue); }

    parents = parents.concat(value);
    value = mapFunc({ value, key, parent, parents, depth });

    if (value && typeof value === 'object') {
      cache.set(originalValue, value);
    }

    ++depth;
    if (value && (value.constructor === Object || value instanceof Array)) {
      each(value, (child, childKey) => {
        value[childKey] = recurse({ value: child, key: childKey, parent: value, parents, depth });
      });
    }

    return value;
  };

  return recurse({ value, key: null, parent: null, parents: [], depth: 0 });
};


module.exports = {
  recurseMapByRef,
};
