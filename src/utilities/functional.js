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
    throw new EngineError(`map utility must be used with objects or arrays: ${obj}`, { reason: 'UTILITY_ERROR' });
  }
};

// Apply map() recursively
const recurseMap = function (value, mapperFunc) {
  // Recursion over objects and arrays
  if (value && (value.constructor === Object || value instanceof Array)) {
    return map(value, child => recurseMap(child, mapperFunc));
  }

  return mapperFunc(value);
};


module.exports = {
  map,
  recurseMap,
};
