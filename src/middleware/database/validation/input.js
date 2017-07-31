'use strict';

const { pickBy, omitBy, fullRecurseMap } = require('../../../utilities');
const { validate } = require('../../../validation');

const { getDataValidationSchema } = require('./schema');

const type = 'clientInputData';

/**
 * Check that input nFilter|newData passes IDL validation
 * E.g. if a model is marked as `required` or `minimum: 10` in IDL file,
 * this will be validated here
 **/
const validateInputData = function ({
  input,
  input: { args, modelName, command, jsl, idl },
}) {
  const schema = getDataValidationSchema({ idl, modelName, command, type });
  const attributes = getAttributes(args);

  return Object.entries(attributes).reduce(
    (inputA, [dataVar, attribute]) =>
      validateAttribute({ input: inputA, dataVar, attribute, schema, jsl }),
    input,
  );
};

const validateAttribute = function ({
  input,
  dataVar,
  attribute,
  schema,
  jsl,
}) {
  const allAttrs = Array.isArray(attribute) ? attribute : [attribute];

  return allAttrs.reduce(
    (inputA, data) =>
      validateSingleAttribute({ input: inputA, dataVar, schema, jsl, data }),
    input,
  );
};

const validateSingleAttribute = function ({
  input,
  dataVar,
  schema,
  jsl,
  data,
}) {
  const value = removeAllJsl(data);
  const reportInfo = { type, dataVar };
  validate({ schema, data: value, reportInfo, extra: jsl });

  return input;
};

/**
 * Keeps the arguments to validate
 **/
const getAttributes = function (args) {
  // TODO: validate `nFilter`
  return pickBy(args, (arg, dataVar) => ['newData'].includes(dataVar) && arg);
};

// Do not validate JSL code
// TODO: remove when using MongoDB query objects
const removeAllJsl = function (value) {
  return fullRecurseMap(value, removeJsl);
};

const removeJsl = function (value) {
  if (Array.isArray(value)) {
    return value.filter(child => typeof child !== 'function');
  }

  if (value && value.constructor === Object) {
    return omitBy(value, child => typeof child === 'function');
  }

  return value;
};

module.exports = {
  validateInputData,
};
