'use strict';

const { assignArray } = require('./reduce');

// Similar to Lodash get(), but do not mutate, and faster
const get = function (obj, keys) {
  if (keys.length === 0) { return obj; }

  const [childKey, ...keysA] = keys;
  const child = obj[childKey];
  return get(child, keysA);
};

// Similar to Lodash set(), but do not mutate, and faster
const set = function (obj, keys, val) {
  if (keys.length === 0) {
    return typeof val === 'function' ? val(obj, keys) : val;
  }

  const [childKey, ...keysA] = keys;
  const child = obj[childKey];
  const childA = set(child, keysA, val);
  return { ...obj, [childKey]: childA };
};

// Apply several set() at once, using an array of `paths`
const setAll = function (obj, paths, val) {
  return paths.reduce(
    (objA, jslPath) => set(objA, jslPath, val),
    obj,
  );
};

// Retrieves all recursive values (i.e. leaves) of an object,
// as a single array of [value, key] elements
const getAll = function (value, key = []) {
  if (value && value.constructor === Object) {
    return Object.entries(value)
      .map(([childKey, child]) => getAll(child, [...key, childKey]))
      .reduce(assignArray, []);
  }

  if (Array.isArray(value)) {
    return value
      .map((child, childKey) => getAll(child, [...key, childKey]))
      .reduce(assignArray, []);
  }

  return [[value, key]];
};

module.exports = {
  get,
  set,
  getAll,
  setAll,
};
