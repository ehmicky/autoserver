'use strict';

const { getWordsList } = require('../../../utilities');

// `validate.type` rule
// Can be 'object', 'function', 'string', 'integer', 'number', 'boolean'.
// Can append '[]' to signify array.
const validateTypes = function ({ optVal, ruleVal }) {
  if (Array.isArray(ruleVal)) {
    return validateManyTypes({ optVal, ruleVal });
  }

  return validateType({ optVal, ruleVal });
};

// `validate.type` can be an array, to signify alternatives
const validateManyTypes = function ({ optVal, ruleVal }) {
  const errors = ruleVal.map(type => validateType({ optVal, ruleVal: type }));

  const noMatch = errors.every(error => error !== undefined);
  if (!noMatch) { return; }

  const message = getWordsList(errors);
  return message;
};

const validateType = function ({ optVal, ruleVal }) {
  // `validate.type` can end with `[]` to signify an array
  const isArray = ruleVal.endsWith('[]');

  if (isArray) {
    return validateArray({ optVal, ruleVal });
  }

  const typeRule = typeRules[ruleVal];
  return typeRule({ optVal });
};

const validateArray = function ({ optVal, ruleVal }) {
  if (!Array.isArray(optVal)) {
    return 'must be an array';
  }

  const type = ruleVal.slice(0, -2);
  const typeRule = typeRules[type];
  const valA = optVal.find(val => typeRule({ optVal: val }));
  if (valA === undefined) { return; }

  const message = typeRule({ optVal: valA });
  return `item ${message}`;
};

const validateObject = function ({ optVal }) {
  if (!optVal || optVal.constructor !== Object) {
    return 'must be an object';
  }
};

const validateFunction = function ({ optVal }) {
  if (typeof optVal !== 'function') {
    return 'must be a function';
  }
};

const validateString = function ({ optVal }) {
  if (typeof optVal !== 'string') {
    return 'must be a string';
  }
};

const validateBoolean = function ({ optVal }) {
  if (typeof optVal !== 'boolean') {
    return 'must be true or false';
  }
};

const validateInteger = function ({ optVal }) {
  if (!Number.isInteger(optVal)) {
    return 'must be an integer';
  }
};

const validateNumber = function ({ optVal }) {
  if (!Number.isFinite(optVal)) {
    return 'must be a number';
  }
};

const typeRules = {
  object: validateObject,
  // Not using quotes messes up with IDE syntax highlighting
  // eslint-disable-next-line quote-props
  'function': validateFunction,
  string: validateString,
  boolean: validateBoolean,
  integer: validateInteger,
  number: validateNumber,
};

module.exports = {
  type: validateTypes,
};
