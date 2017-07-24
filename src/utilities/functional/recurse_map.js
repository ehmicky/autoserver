'use strict';

// Like lodash mapValues(), but recursive and by reference
const recurseMapByRef = function ({ value: val, mapFunc }) {
  const cache = new WeakMap();

  const recurse = function ({ value, key, parent, parents, depth }) {
    // Avoids infinite recursions
    if (cache.has(value)) { return cache.get(value); }

    const nextParents = parents.concat(value);
    const mapVal = mapFunc({ value, key, parent, parents: nextParents, depth });

    if (mapVal && typeof mapVal === 'object') {
      cache.set(value, mapVal);
    }

    recurseChildren({ mapVal, parents: nextParents, depth: depth + 1 });

    return mapVal;
  };

  const recurseChildren = function ({ mapVal, parents, depth }) {
    if (!mapVal) { return; }
    if (mapVal.constructor !== Object && !Array.isArray(mapVal)) { return; }

    for (const [childKey, child] of Object.entries(mapVal)) {
      mapVal[childKey] = recurse({
        value: child,
        key: childKey,
        parent: mapVal,
        parents,
        depth,
      });
    }
  };

  return recurse({
    value: val,
    key: null,
    parent: null,
    parents: [],
    depth: 0,
  });
};

module.exports = {
  recurseMapByRef,
};
