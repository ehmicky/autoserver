'use strict';


const { mapValues } = require('lodash');


// Recursion over objects and arrays
const recurse = function ({ value, cb }) {
  if (!value) { return value; }

  // Recursion over objects and arrays
  if (value.constructor === Object) {
    return mapValues(value, child => recurse({ value: child, cb }));
  }
  if (value instanceof Array) {
    return value.map(child => recurse({ value: child, cb }));
  }

  return cb(value);
};


module.exports = {
  recurse,
};
