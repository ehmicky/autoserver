'use strict';

const { isEqual } = require('./equal');

const includes = function (arr, valA) {
  return arr.some(valB => isEqual(valA, valB));
};

module.exports = {
  includes,
};
