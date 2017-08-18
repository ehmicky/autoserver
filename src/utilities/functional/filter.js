'use strict';

const { checkObject } = require('./validate');
const { fullRecurseMap } = require('./map');

// Similar to lodash pickBy(), but faster.
const pickBy = function (obj, condition) {
  checkObject(obj);

  return Object.entries(obj).reduce((memo, [key, value]) => {
    if (condition(value, key)) {
      // eslint-disable-next-line no-param-reassign, fp/no-mutation
      memo[key] = value;
    }

    return memo;
  }, {});
};

// Like `pickBy()` but recursive
const recursePickBy = function (obj, condition) {
  return fullRecurseMap(obj, child => recursePickByMapper(child, condition));
};

const recursePickByMapper = function (obj, condition) {
  if (!obj) { return obj; }

  if (obj.constructor === Object) {
    return pickBy(obj, condition);
  }

  if (Array.isArray(obj)) {
    return obj.filter(condition);
  }

  return obj;
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
  recursePickBy,
};
