'use strict';

// Similar to Lodash _.invert(), but with plain JavaScript
const invert = function (obj) {
  const objs = Object.entries(obj).map(([key, value]) => ({ [value]: key }));
  const objA = Object.assign({}, ...objs);
  return objA;
};

module.exports = {
  invert,
};
