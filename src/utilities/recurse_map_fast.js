'use strict';


const { map } = require('./functional');


// Like other recurse_map utility, but simpler/faster, by value and does not avoid infinite recursions
const recurseMapFast = function (value, mapperFunc) {
  // Recursion over objects and arrays
  if (value && (value.constructor === Object || value instanceof Array)) {
    return map(value, child => recurseMapFast(child, mapperFunc));
  }

  return mapperFunc(value);
};


module.exports = {
  recurseMapFast,
};
