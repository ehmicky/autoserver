'use strict';

const { assignObject } = require('./reduce');

// Similar to Lodash _.invert(), but with plain JavaScript
const invert = function (obj) {
  return Object.entries(obj)
    .map(([key, value]) => ({ [value]: key }))
    .reduce(assignObject, {});
};

module.exports = {
  invert,
};
