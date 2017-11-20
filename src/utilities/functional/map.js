'use strict';

const { checkObject } = require('./validate');

// Similar to Lodash mapValues(), but with vanilla JavaScript
const mapValues = function (obj, mapperFunc) {
  return generalMap({ obj, mapperFunc, iterationFunc: mapValuesFunc });
};

const mapValuesFunc = function ({ key, obj, newValue }) {
  // eslint-disable-next-line no-param-reassign, fp/no-mutation
  obj[key] = newValue;
  return obj;
};

// Similar to map() for keys
const mapKeys = function (obj, mapperFunc) {
  return generalMap({ obj, mapperFunc, iterationFunc: mapKeysFunc });
};

const mapKeysFunc = function ({ value, obj, newValue }) {
  // eslint-disable-next-line no-param-reassign, fp/no-mutation
  obj[newValue] = value;
  return obj;
};

const generalMap = function ({ obj, mapperFunc, iterationFunc }) {
  checkObject(obj);

  return Object.entries(obj).reduce((objA, [key, value]) => {
    const newValue = mapperFunc(value, key, obj);
    return iterationFunc({ value, key, obj: objA, newValue });
  }, {});
};

// Same but async
const mapValuesAsync = async function (obj, mapperFunc) {
  checkObject(obj);

  const promises = Object.entries(obj).map(([key, value]) =>
    mapValueAsync({ key, value, obj, mapperFunc }));

  // Run in parallel
  const valuesArray = await Promise.all(promises);
  const valuesObj = Object.assign({}, ...valuesArray);

  return valuesObj;
};

const mapValueAsync = function ({ key, value, obj, mapperFunc }) {
  const mappedVal = mapperFunc(value, key, obj);
  const promise = Promise.resolve(mappedVal);
  // eslint-disable-next-line promise/prefer-await-to-then
  return promise.then(val => ({ [key]: val }));
};

// Apply map() recursively
const recurseMap = function (
  value,
  mapperFunc,
  { key, onlyLeaves = true } = {},
) {
  const recurseFunc = getRecurseFunc(value);
  const nextValue = recurseFunc
    ? recurseFunc((child, childKey) =>
      recurseMap(child, mapperFunc, { key: childKey, onlyLeaves }))
    : value;

  if (recurseFunc && onlyLeaves) { return nextValue; }
  return mapperFunc(nextValue, key);
};

const getRecurseFunc = function (value) {
  if (value && value.constructor === Object) {
    return mapValues.bind(null, value);
  }

  if (Array.isArray(value)) {
    return value.map.bind(value);
  }
};

const fullRecurseMap = function (value, mapperFunc, opts = {}) {
  const optsA = { ...opts, onlyLeaves: false };
  return recurseMap(value, mapperFunc, optsA);
};

module.exports = {
  mapValues,
  mapValuesAsync,
  mapKeys,
  recurseMap,
  fullRecurseMap,
};
