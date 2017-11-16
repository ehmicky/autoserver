'use strict';

const CONTENT_TYPES = {
  model: content => isObject(content),

  models: content => isArray(content) && content.every(isObject),

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

const MODEL_TYPES = ['model', 'models', 'error'];
const OBJECT_TYPES = ['model', 'models', 'error', 'object'];
const ERROR_TYPES = ['error'];

module.exports = {
  CONTENT_TYPES,
  MODEL_TYPES,
  OBJECT_TYPES,
  ERROR_TYPES,
};
