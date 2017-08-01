'use strict';

const {
  pickBy,
  omitBy,
  fullRecurseMap,
  memoize,
} = require('../../../utilities');
const { validate } = require('../../../validation');

const { getRequired } = require('./required');

/**
 * Check that input nFilter|newData passes IDL validation
 * E.g. if a model is marked as `required` or `minimum: 10` in IDL file,
 * this will be validated here
 **/
const validateInputData = function ({
  input,
  input: { args, modelName, command, jsl, idl },
}) {
  const schema = mGetDataValidationSchema({ idl, modelName, command });
  const attrs = getAttrs(args);

  return Object.entries(attrs).reduce(
    (inputA, [dataVar, attr]) =>
      validateAttr({ input: inputA, dataVar, attr, schema, jsl }),
    input,
  );
};

// Retrieves JSON schema to validate against
const getDataValidationSchema = function ({ idl, modelName, command }) {
  const model = idl.models[modelName];
  const required = getRequired({ model, command });
  return { ...model, ...required };
};

const mGetDataValidationSchema = memoize(getDataValidationSchema);

// Keeps the arguments to validate
const getAttrs = function (args) {
  // TODO: validate `nFilter`
  return pickBy(args, (arg, dataVar) => ['newData'].includes(dataVar) && arg);
};

const validateAttr = function ({ input, dataVar, attr, schema, jsl }) {
  const attrArray = Array.isArray(attr) ? attr : [attr];

  return attrArray.reduce(
    (inputA, data) =>
      validateSingleAttr({ input: inputA, dataVar, schema, jsl, data }),
    input,
  );
};

const validateSingleAttr = function ({ input, dataVar, schema, jsl, data }) {
  const value = removeAllJsl(data);
  const reportInfo = { type, dataVar };
  validate({ schema, data: value, reportInfo, extra: jsl });

  return input;
};

const type = 'clientInputData';

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
