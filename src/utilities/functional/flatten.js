'use strict';

// Like Lodash flatten()
const flatten = function (arrays) {
  return arrays.reduce(flattenReducer, []);
};

const flattenReducer = function (memo, val) {
  return memo.concat(val);
};

module.exports = {
  flatten,
};
