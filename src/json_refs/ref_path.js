'use strict';

const { isEqual } = require('../utilities');
const { addErrorHandler } = require('../error');

const REF_SYM = Symbol('ref');

// Set original JSON reference's path so it can be serialized back
const setRefPath = function ({ content, refPath, isTopLevel }) {
  if (isTopLevel || eIsJson(content)) {
    return content;
  }

  // eslint-disable-next-line no-param-reassign, fp/no-mutation
  content[REF_SYM] = refPath;

  return content;
};

// Do not need to serialize back a JSON reference's value if it was JSON
// compatible
const isJson = function (value) {
  const type = typeof value;

  if (type === 'symbol' || type === 'function') {
    return false;
  }

  if (type !== 'object') { return true; }

  const valueA = JSON.parse(JSON.stringify(value));
  return isEqual(valueA, value);
};

// If JSON.stringify() throws, it means it is not JSON compatible
const isJsonHandler = () => false;

const eIsJson = addErrorHandler(isJson, isJsonHandler);

// Stringify an object with previous JSON references, and restore them first.
const stringifyWithRefs = function (obj) {
  return JSON.stringify(obj, stringify, 2);
};

const stringify = function (key, val) {
  if (val == null || val[REF_SYM] === undefined) { return val; }

  return { $ref: val[REF_SYM] };
};

module.exports = {
  setRefPath,
  stringifyWithRefs,
};
