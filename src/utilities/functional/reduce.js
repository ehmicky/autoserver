'use strict';

// Uses to reduce:
//  - an array of objects -> object, e.g. [{...},{...}].reduce(assign, {})
//  - an array of [key, value] -> object,
//    e.g. Object.entries(object).map(...).reduce(assign, {})
const assignObject = function (memo, val) {
  const obj = Array.isArray(val) ? { [val[0]]: val[1] } : val;
  return { ...memo, ...(obj || {}) };
};

// Uses to reduce:
//  - several values -> array, e.g. array.map(...).reduce(assign, [])
const assignArray = function (memo, val) {
  return memo.concat(val);
};

// Like Array.reduce(), but supports async
const reduceAsync = function (array, mapperFunc, prevVal) {
  return asyncReducer(prevVal, { array, mapperFunc });
};

const asyncReducer = function (prevVal, input) {
  const { array, mapperFunc, index = 0 } = input;
  if (index === array.length) { return prevVal; }

  const nextVal = mapperFunc(prevVal, array[index], index, array);
  const inputA = { ...input, index: index + 1 };

  // Do not use async|await to avoid creating promises on iterations that
  // are synchronous, for performance reason.
  // eslint-disable-next-line promise/prefer-await-to-then
  if (typeof nextVal.then === 'function') {
    // eslint-disable-next-line promise/prefer-await-to-then
    return nextVal.then(nextValA => asyncReducer(nextValA, inputA));
  }

  return asyncReducer(nextVal, inputA);
};

module.exports = {
  assignObject,
  assignArray,
  reduceAsync,
};
