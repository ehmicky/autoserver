'use strict';


const { mapValues } = require('lodash');


// Like lodash mapValues(), but recursive, avoiding infinite recursion
const recurseMap = function (val, func) {
  return recurse(val, null, null, func, []);
};
const recurse = function (val, key, parent, func, cache) {
  const isObject = val && val.constructor === Object;
  const isArray = val && val instanceof Array;
  if (isObject || isArray) {
    if (cache.includes(val)) { return; }
    cache.push(val);
    if (isObject) {
      val = mapValues(val, (child, childKey) => recurse(child, childKey, val, func, cache));
    }
    if (isArray) {
      val = val.map((child, childKey) => recurse(child, childKey, val, func, cache));
    }
  }
  return func(val, key, parent);
};


module.exports = {
  recurseMap,
};
