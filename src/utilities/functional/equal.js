'use strict';

const { isDeepStrictEqual } = require('util');

// Like Lodash isEqual(), but faster
const isEqual = function (valA, valB) {
  if (typeof valA !== 'object' || typeof valB !== 'object') {
    return valA === valB;
  }

  return isDeepStrictEqual(valA, valB);
};

module.exports = {
  isEqual,
};
