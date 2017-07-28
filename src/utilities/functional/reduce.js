'use strict';

// Uses to reduce:
//  - an array of objects -> object, e.g. [{...},{...}].reduce(assign, {})
//  - an array of [key, value] -> object,
//    e.g. Object.entries(object).map(...).reduce(assign, {})
const assignObject = function (memo, val) {
  const obj = Array.isArray(val) ? { [val[0]]: val[1] } : val;
  return Object.assign({}, memo, obj);
};

// Uses to reduce:
//  - several values -> array, e.g. array.map(...).reduce(assign, [])
const assignArray = function (memo, val) {
  return memo.concat(val);
};

// Like Array.reduce(), but async
const reduceAsync = async function (arr, mapperFunc, initial) {
  const finalValue = await arr.reduce(async (memo, value, index) => {
    const previousValue = await Promise.resolve(memo);
    return mapperFunc(previousValue, value, index, arr);
  }, initial);
  return finalValue;
};

module.exports = {
  assignObject,
  assignArray,
  reduceAsync,
};
