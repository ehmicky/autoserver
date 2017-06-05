'use strict';


const { EngineError } = require('../error');
const { getPromise } = require('./promise');


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
const set = function ({ obj, path, value }) {
  if (typeof path === 'string') {
      path = path.split('.');
  }

  if (!obj) { return obj; }

  if (obj instanceof Array) {
    return obj.map(elem => set({ obj: elem, path, value }));
  }

  if (obj.constructor !== Object) { return obj; }

  if (path.length === 1) {
    obj[path[0]] = typeof value === 'function' ? value(obj[path[0]]) : value;
    return obj;
  } else if (path.length > 1) {
    const newPath = path.slice(1);
    return map(obj, elem => set({ obj: elem, path: newPath, value }));
  }
};

// Deep merge objects and arrays (concatenates for arrays)
const deepMerge = function (objA, objB, ...objects) {
  if (!objA) { return; }
  if (!objB) { return objA; }
  if (objects.length > 0) {
    return deepMerge(deepMerge(objA, objB), ...objects);
  }

  const isInvalidType =
    (objA.constructor !== Object && !(objA instanceof Array)) ||
    (objB.constructor !== Object && !(objB instanceof Array));
  const isDifferentTypes =
    (objA.constructor === Object && objB.constructor !== Object) ||
    (objA.constructor !== Object && objB.constructor === Object);
  if (isInvalidType || isDifferentTypes) {
    const message = `'deepMerge' utility can only merge together objects or arrays: ${JSON.stringify(objA)} and ${JSON.stringify(objB)}`;
    throw new EngineError(message, { reason: 'UTILITY_ERROR' });
  }

  if (objA instanceof Array) {
    return [...objA, ...objB];
  }

  if (objA.constructor === Object) {
    const newObjA = Object.assign({}, objA);
    for (const [objBKey, objBVal] of Object.entries(objB)) {
      const objAVal = newObjA[objBKey];
      const shouldDeepMerge = objAVal &&
        objBVal &&
        ((objAVal instanceof Array && objBVal instanceof Array) ||
        (objAVal.constructor === Object && objBVal.constructor === Object));
      newObjA[objBKey] = shouldDeepMerge
        ? deepMerge(objAVal, objBVal)
        : objBVal;
    }
    return newObjA;
  }
};

// Enforces that a function is only called once
const onlyOnce = function (func, { error = false } = {}) {
  return (...args) => {
    if (func.called) {
      if (error) {
        throw new Error('This function can only be called once');
      }
      return;
    }

    func.called = true;
    return func(...args);
  };
};

// Returns the function with the two added methods:
//   - func.cork() will buffer calls, i.e. it will become a noop
//   - func.uncork() will release all buffered calls
// Works with async functions as well.
const buffer = function (func, context = null) {
  const state = getBufferState();
  const newFunc = bufferedFunc.bind(context, state, func);

  const cork = corkFunc.bind(null, state);
  const uncork = uncorkFunc.bind(context, state, func);
  Object.assign(newFunc, { cork, uncork });

  return newFunc;
};

const getBufferState = () => ({
  isBuffered: false,
  bufferedCalls: [],
});

const bufferedFunc = async function (state, func, ...args) {
  if (state.isBuffered) {
    state.bufferedCalls.push(args);
    return;
  }

  await func.call(this, ...args);
};

const corkFunc = function (state) {
  state.isBuffered = true;
};

const uncorkFunc = async function (state, func) {
  for (const args of state.bufferedCalls) {
    await func.call(this, ...args);
  }
  state.isBuffered = false;
};

// Like `setTimeout` but with a promise
const waitFor = function (delay = 0) {
  const promise = getPromise();
  setTimeout(() => {
    promise.resolve();
  }, delay);
  return promise;
};


module.exports = {
  map,
  mapAsync,
  recurseMap,
  set,
  deepMerge,
  onlyOnce,
  buffer,
  waitFor,
};
