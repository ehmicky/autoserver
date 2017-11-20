'use strict';

const { flatten } = require('./flatten');
const { result } = require('./result');

// Similar to Lodash get(), but do not mutate, and faster
const get = function (obj, keys) {
  if (keys.length === 0) { return obj; }

  const [childKey, ...keysA] = keys;
  const child = obj[childKey];
  return get(child, keysA);
};

// Similar to Lodash set(), but do not mutate, and faster
const set = function (objArr, keys, val) {
  if (keys.length === 0) {
    return result(val, objArr, keys);
  }

  if (typeof keys[0] === 'number') {
    return setArray(objArr, keys, val);
  }

  return setObject(objArr, keys, val);
};

const setObject = function (obj = {}, keys, val) {
  const { child, childKey } = setVal({ objArr: obj, keys, val });

  return { ...obj, [childKey]: child };
};

const setArray = function (arr = [], keys, val) {
  const { child, childKey } = setVal({ objArr: arr, keys, val });

  return [
    ...arr.slice(0, childKey),
    child,
    ...arr.slice(childKey + 1),
  ];
};

const setVal = function ({ objArr, keys, val }) {
  const [childKey, ...keysA] = keys;
  const child = objArr[childKey];
  const childA = set(child, keysA, val);

  return { child: childA, childKey };
};

// Apply several set() at once, using an array of `paths`
const setAll = function (obj, paths, val) {
  return paths.reduce(
    (objA, inlineFuncPath) => set(objA, inlineFuncPath, val),
    obj,
  );
};

// Retrieves all recursive values (i.e. leaves) of an object,
// as a single array of [value, key] elements
const getAll = function (value, key = []) {
  if (value && value.constructor === Object) {
    const values = Object.entries(value)
      .map(([childKey, child]) => getAll(child, [...key, childKey]));
    const valuesA = flatten(values);
    return valuesA;
  }

  if (Array.isArray(value)) {
    const values = value
      .map((child, childKey) => getAll(child, [...key, childKey]));
    const valuesA = flatten(values);
    return valuesA;
  }

  return [[value, key]];
};

// Similar to Lodash has(), but faster
const has = function (obj, keys) {
  try {
    get(obj, keys);
  } catch (error) {
    return false;
  }

  return true;
};

module.exports = {
  get,
  set,
  getAll,
  setAll,
  has,
};
