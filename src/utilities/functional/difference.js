'use strict';

const { includes } = require('./includes');
const { uniq } = require('./uniq');

// Like Lodash difference()
const difference = function (arrA, arrB) {
  return arrA.filter(val => !includes(arrB, val));
};

// Like Lodash difference()
const intersection = function (arrA, arrB, ...arrays) {
  const arrC = arrA.filter(val => includes(arrB, val));
  if (arrays.length === 0) { return uniq(arrC); }

  return intersection(arrC, ...arrays);
};

module.exports = {
  difference,
  intersection,
};
