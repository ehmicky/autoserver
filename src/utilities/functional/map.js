'use strict';

const { checkObject } = require('./validate');
const { assignObject } = require('./reduce');

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
const recurseMap = function ({ value, mapperFunc, onlyLeaves = true }) {
  const isObject = value && value.constructor === Object;
  const isArray = Array.isArray(value);

  if (isObject || isArray) {
    value = isObject
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
    if (onlyLeaves) { return value; }
  }

  return mapperFunc(value);
};

// Like lodash mapValues(), but recursive and by reference
const recurseMapByRef = function ({ value: val, mapFunc }) {
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

    depth += 1;

    if (value && (value.constructor === Object || Array.isArray(value))) {
      for (const [childKey, child] of Object.entries(value)) {
        value[childKey] = recurse({ value: child, key: childKey, parent: value, parents, depth });
      }
    }

    return value;
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
