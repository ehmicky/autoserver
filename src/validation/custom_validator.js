'use strict';

const { runConfigFunc, getModelParams } = require('../functions');
const { memoize } = require('../utilities');

const { validator } = require('./validator');

// Add custom validation keywords, from config.validation
const getCustomValidator = function ({ config: { validation = {} } = {} }) {
  return Object.entries(validation).reduce(addCustomKeyword, validator);
};

// We do want the re-run if config.validation changes.
// Serializing the whole config as is too slow, so we just take keywords
// list.
const serializer = function ({ config: { validation = {} } = {} }) {
  return Object.keys(validation).join(',');
};

const mGetCustomValidator = memoize(getCustomValidator, { serializer });

const addCustomKeyword = function (
  validatorA,
  [
    keyword,
    { test: testFunc, message, type },
  ],
) {
  // We name `null` `empty` in config, as it is more YAML-friendly
  const typeA = type === 'empty' ? 'null' : type;

  validateCustomKeyword({ type: typeA, keyword });

  const validate = keywordFunc({ keyword, testFunc, message });
  validatorA.addKeyword(keyword, { validate, type: typeA, $data: true });

  return validatorA;
};

const validateCustomKeyword = function ({ type, keyword }) {
  const isRedundant = Array.isArray(type) &&
    type.includes('number') &&
    type.includes('integer');
  if (!isRedundant) { return; }

  const message = `Custom validation keyword 'config.validation.${keyword}' must not have both types 'number' and 'integer', as 'number' includes 'integer'.`;
  // eslint-disable-next-line fp/no-throw
  throw new Error(message);
};

// eslint-disable-next-line max-params
const keywordFunc = ({ keyword, testFunc, message }) => function validate (
  arg,
  dataVal,
  parentSchema,
  dataPath,
  model,
  attrName,
  { [Symbol.for('extra')]: { mInput, currentDatum: previousmodel } }
) {
  const modelParams = getModelParams({ model, attrName, previousmodel });
  const params = { arg, ...modelParams };

  const isValid = runConfigFunc({ configFunc: testFunc, mInput, params });
  if (isValid === true) { return true; }

  const messageA = runConfigFunc({ configFunc: message, mInput, params });

  // eslint-disable-next-line fp/no-mutation
  validate.errors = [{ message: messageA, keyword, params: { arg } }];

  return false;
};

module.exports = {
  getCustomValidator: mGetCustomValidator,
};
