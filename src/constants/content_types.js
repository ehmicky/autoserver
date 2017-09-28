'use strict';

const CONTENT_TYPES = {
  model: ({ data } = {}) => isObject(data),

  collection: ({ data } = {}) => isArray(data) && data.every(isObject),

  error: content => isObject(content),

  object: content => isObject(content),

  html: content => typeof content === 'string',

  text: content => typeof content === 'string',
};

const isObject = function (value) {
  return value &&
    [Object, undefined].includes(value.constructor) &&
    isJSON(value);
};

const isArray = function (value) {
  return value && Array.isArray(value) && isJSON(value);
};

const isJSON = function (val) {
  try {
    JSON.stringify(val);
  } catch (error) { return false; }

  return true;
};

module.exports = {
  CONTENT_TYPES,
};
