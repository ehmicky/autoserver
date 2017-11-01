'use strict';

const { includes } = require('./includes');

// Like Lodash uniq(), but deep equal, and can use mapper functions
const uniq = function (arr, mapper) {
  const mappedArr = mapper === undefined ? arr : arr.map(mapper);
  return arr.filter((val, index) => isUnique(mappedArr, index));
};

// Returns first duplicate
const findDuplicate = function (arr, mapper) {
  const mappedArr = mapper === undefined ? arr : arr.map(mapper);
  return arr.find((val, index) => !isUnique(mappedArr, index));
};

const isUnique = function (mappedArr, index) {
  const nextVals = mappedArr.slice(index + 1);
  return !includes(nextVals, mappedArr[index]);
};

module.exports = {
  uniq,
  findDuplicate,
};
