'use strict';

const CONTENT_TYPES = {
  model: ({ content }) => isObject(content),

  collection: ({ content }) => isObject(content) || isArray(content),

  error: ({ content }) => isObject(content),

  object: ({ content }) => isObject(content),

  html: ({ content }) => typeof content === 'string',

  text: ({ content }) => typeof content === 'string',

  failure: ({ content }) => content === undefined,
};

const isObject = function (value) {
  return value && value.constructor === Object && isJSON(value);
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
