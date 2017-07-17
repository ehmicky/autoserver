'use strict';

const { checkObject } = require('./validate');

// Similar to lodash pick(), but faster.
const pick = function (obj, attributes) {
  checkObject(obj);

  attributes = attributes instanceof Array ? attributes : [attributes];
  return pickBy(obj, (value, name) => attributes.includes(name));
};

// Similar to lodash pickBy(), but faster.
const pickBy = function (obj, condition) {
  checkObject(obj);

  return Object.entries(obj).reduce((memo, [name, value]) => {
    if (condition(value, name)) {
      memo[name] = value;
    }

    return memo;
  }, {});
};

// Similar to lodash omit(), but faster.
const omit = function (obj, attributes) {
  checkObject(obj);

  attributes = attributes instanceof Array ? attributes : [attributes];
  return omitBy(obj, (value, name) => attributes.includes(name));
};

// Similar to lodash omitBy(), but faster.
const omitBy = function (obj, condition) {
  checkObject(obj);

  return Object.entries(obj).reduce((memo, [name, value]) => {
    if (!condition(value, name)) {
      memo[name] = value;
    }

    return memo;
  }, {});
};

module.exports = {
  pick,
  pickBy,
  omit,
  omitBy,
};
