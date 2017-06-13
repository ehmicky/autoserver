'use strict';


// Similar to Lodash map() and mapValues(), but with vanilla JavaScript
const map = function (obj, mapperFunc) {
  if (obj instanceof Array) {
    return obj.map(mapperFunc);
  }

  if (!obj || obj.constructor !== Object) {
    const message = `map utility must be used with objects or arrays: ${JSON.stringify(obj)}`;
    throw new Error(message);
  }

  return Object.entries(obj).reduce((newObj, [key, value]) => {
    newObj[key] = mapperFunc(value, key, obj);
    return newObj;
  }, {});
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
    throw new Error(message);
  }
};

// Similar to map() for keys
const mapKeys = function (obj, mapperFunc) {
  if (!obj || obj.constructor !== Object) {
    const message = `map utility must be used with objects or arrays: ${JSON.stringify(obj)}`;
    throw new Error(message);
  }

  return Object.entries(obj).reduce((newObj, [key, value]) => {
    newObj[mapperFunc(key, value, obj)] = value;
    return newObj;
  }, {});
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
    throw new Error(message);
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

// Similar to lodash pick(), but faster.
const pick = function (obj, attributes) {
  attributes = attributes instanceof Array ? attributes : [attributes];
  return pickBy(obj, (value, name) => attributes.includes(name));
};

// Similar to lodash pickBy(), but faster.
const pickBy = function (obj, condition) {
  return Object.entries(obj).reduce((memo, [name, value]) => {
    if (condition(value, name)) {
      memo[name] = value;
    }
    return memo;
  }, {});
};

// Similar to lodash omit(), but faster.
const omit = function (obj, attributes) {
  attributes = attributes instanceof Array ? attributes : [attributes];
  return omitBy(obj, (value, name) => attributes.includes(name));
};

// Similar to lodash omitBy(), but faster.
const omitBy = function (obj, condition) {
  return Object.entries(obj).reduce((memo, [name, value]) => {
    if (!condition(value, name)) {
      memo[name] = value;
    }
    return memo;
  }, {});
};

// Uses to reduce:
//  - an array of objects -> object, e.g. [{...},{...}].reduce(assign, {})
//  - an array of [key, value] -> object,
//    e.g. Object.entries(object).map(...).reduce(assign, {})
const assignObject = function (memo, val) {
  const obj = val instanceof Array ? { [val[0]]: val[1] } : val;
  return Object.assign(memo, obj);
};

// Uses to reduce:
//  - several values -> array, e.g. array.map(...).reduce(assign, [])
const assignArray = function (memo, val) {
  return memo.concat(val);
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

// Returns the function with the two added functions:
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


module.exports = {
  map,
  mapAsync,
  mapKeys,
  recurseMap,
  deepMerge,
  pick,
  pickBy,
  omit,
  omitBy,
  assignObject,
  assignArray,
  onlyOnce,
  buffer,
};
