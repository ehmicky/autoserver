'use strict';

const { checkObject } = require('./validate');

// Similar to lodash pickBy(), but faster.
const pickBy = function (obj, condition) {
  checkObject(obj);

  return Object.entries(obj).reduce((memo, [key, value]) => {
    if (condition(value, key)) {
      memo[key] = value;
    }

    return memo;
  }, {});
};

// Similar to lodash omitBy(), but faster.
const omitBy = function (obj, condition) {
  return pickBy(obj, (...args) => !condition(...args));
};

// Similar to lodash pick(), but faster.
const pick = function (obj, attribute) {
  return picker({ obj, attribute, shouldOmit: false });
};

// Similar to lodash omit(), but faster.
const omit = function (obj, attribute) {
  return picker({ obj, attribute, shouldOmit: true });
};

const picker = function ({ obj, attribute, shouldOmit = false }) {
  const attributes = Array.isArray(attribute) ? attribute : [attribute];
  const pickFunc = shouldOmit ? omitBy : pickBy;
  return pickFunc(obj, (value, key) => attributes.includes(key));
};

module.exports = {
  pick,
  pickBy,
  omit,
  omitBy,
};
