'use strict';

// Is any kind of object, including array, RegExp, Date, Error, etc.
const isObjectType = function (val) {
  return typeof val === 'object' && val !== null;
};

// Is a plain object, including `Object.create(null)`
const isObject = function (val) {
  return val != null &&
    (val.constructor === Object || val.constructor === undefined);
};

module.exports = {
  isObjectType,
  isObject,
};
