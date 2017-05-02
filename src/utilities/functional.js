'use strict';


const { EngineError } = require('../error');


// Similar to Lodash map() and mapValues(), but with vanilla JavaScript
const map = function (obj, mapperFunc) {
  if (obj && obj.constructor === Object) {
    for (const [key, value] of Object.entries(obj)) {
      obj[key] = mapperFunc(value, key, obj);
    }
    return obj;
  } else if (obj instanceof Array) {
    return obj.map(mapperFunc);
  } else {
    throw new EngineError(`map utility must be used with objects or arrays: ${obj}`, { reasons: 'UTILITY_ERROR' });
  }
};


module.exports = {
  map,
};
