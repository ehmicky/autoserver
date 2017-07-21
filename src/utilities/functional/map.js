'use strict';

const { checkObject } = require('./validate');
const { assignObject } = require('./reduce');

// Similar to Lodash mapValues(), but with vanilla JavaScript
const mapValues = function (obj, mapperFunc) {
  return generalMap({ obj, mapperFunc, iterationFunc: mapValuesFunc });
};

const mapValuesFunc = function ({ key, obj, newValue }) {
  obj[key] = newValue;
  return obj;
};

// Similar to map() for keys
const mapKeys = function (obj, mapperFunc) {
  return generalMap({ obj, mapperFunc, iterationFunc: mapKeysFunc });
};

const mapKeysFunc = function ({ value, obj, newValue }) {
  obj[newValue] = value;
  return obj;
};

const generalMap = function ({ obj, mapperFunc, iterationFunc }) {
  checkObject(obj);

  return Object.entries(obj).reduce((newObj, [key, value]) => {
    const newValue = mapperFunc(value, key, obj);
    return iterationFunc({ value, key, obj: newObj, newValue });
  }, {});
};

// Same but async
const mapAsync = async function (obj, mapperFunc) {
  checkObject(obj);

  const promises = Object.entries(obj).map(([key, value]) => {
    const mappedVal = mapperFunc(value, key, obj);
    const promise = Promise.resolve(mappedVal);
    // eslint-disable-next-line promise/prefer-await-to-then
    return promise.then(val => ({ [key]: val }));
  });

  // Run in parallel
  const valuesArray = await Promise.all(promises);
  const valuesObj = valuesArray.reduce(assignObject, {});

  return valuesObj;
};

// Apply map() recursively
const recurseMap = function ({ value, mapperFunc, onlyLeaves = true }) {
  const isObject = value && value.constructor === Object;
  const isArray = Array.isArray(value);
  if (!isObject && !isArray) { return mapperFunc(value); }

  const nextValue = isObject
    ? mapValues(value, child => recurseMap({
      value: child,
      mapperFunc,
      onlyLeaves,
    }))
    : value.map(child => recurseMap({
      value: child,
      mapperFunc,
      onlyLeaves,
    }));
  if (onlyLeaves) { return nextValue; }

  return mapperFunc(nextValue);
};

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

    const nextDepth = depth + 1;

    if (mapVal && (mapVal.constructor === Object || Array.isArray(mapVal))) {
      for (const [childKey, child] of Object.entries(mapVal)) {
        mapVal[childKey] = recurse({
          value: child,
          key: childKey,
          parent: mapVal,
          parents: nextParents,
          depth: nextDepth,
        });
      }
    }

    return mapVal;
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
  mapValues,
  mapAsync,
  mapKeys,
  recurseMap,
  recurseMapByRef,
};
