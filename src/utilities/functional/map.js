'use strict';

const { checkObject } = require('./validate');

// Similar to Lodash mapValues(), but with vanilla JavaScript
const mapValues = function (obj, mapperFunc) {
  checkObject(obj);

  return Object.entries(obj).reduce((newObj, [key, value]) => {
    const newValue = mapperFunc(value, key, obj);
    newObj[key] = newValue;
    return newObj;
  }, {});
};

// Same but async
const mapAsync = async function (obj, mapperFunc) {
  checkObject(obj);

  const newObj = {};

  for (const [key, value] of Object.entries(obj)) {
    newObj[key] = await mapperFunc(value, key, obj);
  }

  return newObj;
};

// Similar to map() for keys
const mapKeys = function (obj, mapperFunc) {
  checkObject(obj);

  return Object.entries(obj).reduce((newObj, [key, value]) => {
    const newKey = mapperFunc(key, value, obj);
    newObj[newKey] = value;
    return newObj;
  }, {});
};

// Apply map() recursively
const recurseMap = function (value, mapperFunc, onlyLeaves = true) {
  const isObject = value && value.constructor === Object;
  const isArray = value instanceof Array;

  if (isObject || isArray) {
    value = isObject
      ? mapValues(value, child => recurseMap(child, mapperFunc, onlyLeaves))
      : value.map(child => recurseMap(child, mapperFunc, onlyLeaves));
    if (onlyLeaves) { return value; }
  }

  return mapperFunc(value);
};

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
      for (const [childKey, child] of Object.entries(value)) {
        value[childKey] = recurse({ value: child, key: childKey, parent: value, parents, depth });
      }
    }

    return value;
  };

  return recurse({ value, key: null, parent: null, parents: [], depth: 0 });
};

module.exports = {
  mapValues,
  mapAsync,
  mapKeys,
  recurseMap,
  recurseMapByRef,
};
