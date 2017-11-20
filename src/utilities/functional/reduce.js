'use strict';

const { promiseThen } = require('./promise');

// Like Array.reduce(), but supports async
// eslint-disable-next-line max-params
const reduceAsync = function (array, mapFunc, prevVal, secondMapFunc) {
  return asyncReducer(prevVal, { array, mapFunc, secondMapFunc });
};

const asyncReducer = function (prevVal, input) {
  const { array, mapFunc, index = 0 } = input;
  if (index === array.length) { return prevVal; }

  const nextVal = mapFunc(prevVal, array[index], index, array);
  const inputA = { ...input, index: index + 1 };

  return promiseThen(nextVal, applySecondMap.bind(null, prevVal, inputA));
};

const applySecondMap = function (prevVal, input, nextVal) {
  if (!input.secondMapFunc) {
    return asyncReducer(nextVal, input);
  }

  const nextValA = input.secondMapFunc(prevVal, nextVal);
  return asyncReducer(nextValA, input);
};

module.exports = {
  reduceAsync,
};
