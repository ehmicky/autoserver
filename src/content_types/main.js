'use strict';

const CONTENT_TYPES = {
  model: {
    validate: content => isObject(content),
    types: ['model', 'object'],
  },

  models: {
    validate: content => isArray(content) && content.every(isObject),
    types: ['model', 'object'],
  },

  error: {
    validate: content => isObject(content),
    types: ['model', 'object', 'error'],
  },

  object: {
    validate: content => isObject(content),
    types: ['object'],
  },

  html: {
    validate: content => typeof content === 'string',
    types: [],
  },

  text: {
    validate: content => typeof content === 'string',
    types: [],
  },
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

const isType = function (contentType, type) {
  return CONTENT_TYPES[contentType] !== undefined &&
    CONTENT_TYPES[contentType].types.includes(type);
};

module.exports = {
  CONTENT_TYPES,
  isType,
};
