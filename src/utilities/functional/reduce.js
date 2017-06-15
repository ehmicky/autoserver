'use strict';


// Uses to reduce:
//  - an array of objects -> object, e.g. [{...},{...}].reduce(assign, {})
//  - an array of [key, value] -> object,
//    e.g. Object.entries(object).map(...).reduce(assign, {})
const assignObject = function (memo, val) {
  const obj = val instanceof Array ? { [val[0]]: val[1] } : val;
  return Object.assign(memo, obj);
};

// Uses to reduce:
//  - several values -> array, e.g. array.map(...).reduce(assign, [])
const assignArray = function (memo, val) {
  return memo.concat(val);
};


module.exports = {
  assignObject,
  assignArray,
};
