'use strict';

const { promiseThen } = require('./promise');

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

// Uses to extra `obj[attrName]` and group them in a map using attrName as key
// E.g. [{ a: 1 }, { a: 2 }, { b: 3 }] -> { a: [1, 2], b: [3] }
const mergeArrayReducer = function (attrName) {
  return mergeArray.bind(null, attrName);
};

const mergeArray = function (attrName, array, obj) {
  const key = obj[attrName];
  const { [key]: objs = [] } = array;
  const objsA = [...objs, obj];
  return { ...array, [key]: objsA };
};

module.exports = {
  assignObject,
  assignArray,
  reduceAsync,
  mergeArrayReducer,
};
