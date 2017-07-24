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

module.exports = {
  mapValues,
  mapAsync,
  mapKeys,
  recurseMap,
};
