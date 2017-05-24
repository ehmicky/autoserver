'use strict';


const { EngineError } = require('../error');


// Similar to Lodash map() and mapValues(), but with vanilla JavaScript
const map = function (obj, mapperFunc) {
  if (obj && obj.constructor === Object) {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      newObj[key] = mapperFunc(value, key, obj);
    }
    return newObj;
  } else if (obj instanceof Array) {
    return obj.map(mapperFunc);
  } else {
    const message = `map utility must be used with objects or arrays: ${JSON.stringify(obj)}`;
    throw new EngineError(message, { reason: 'UTILITY_ERROR' });
  }
};

// Same but async
const mapAsync = async function (obj, mapperFunc) {
  if (obj && (obj.constructor === Object || obj instanceof Array)) {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      newObj[key] = await mapperFunc(value, key, obj);
    }
    return newObj;
  } else {
    const message = `map utility must be used with objects or arrays: ${JSON.stringify(obj)}`;
    throw new EngineError(message, { reason: 'UTILITY_ERROR' });
  }
};

// Apply map() recursively
const recurseMap = function (value, mapperFunc, onlyLeaves = true) {
  // Recursion over objects and arrays
  if (value && (value.constructor === Object || value instanceof Array)) {
    value = map(value, child => recurseMap(child, mapperFunc, onlyLeaves));
    return onlyLeaves ? value : mapperFunc(value);
  }

  return mapperFunc(value);
};

// Set values recursively within an obj, using a dot-delimited path
// I.e. similar to Lodash __.set() except it traverses array
// Can also set a test(value) function to conditionally assign `value`
const set = function ({ obj, path, value, test }) {
  if (typeof path === 'string') {
      path = path.split('.');
  }

  if (!obj) { return obj; }

  if (obj instanceof Array) {
    return obj.map(elem => set({ obj: elem, path, value, test }));
  }

  if (obj.constructor !== Object) { return obj; }

  if (path.length === 1) {
    if (test && !test(obj[path[0]])) { return obj; }

    obj[path[0]] = value;
    return obj;
  } else if (path.length > 1) {
    const newPath = path.slice(1);
    return map(obj, elem => set({ obj: elem, path: newPath, value, test }));
  }
};


module.exports = {
  map,
  mapAsync,
  recurseMap,
  set,
};
