'use strict';

const { pickBy, omitBy, fullRecurseMap } = require('../../../utilities');
const { validate } = require('../../../validation');

const { getDataValidationSchema } = require('./schema');

// Check that input nFilter|newData passes IDL validation
// E.g. if a model is marked as `required` or `minimum: 10` in IDL file,
// this will be validated here
const validateInputData = function ({
  input,
  input: { args, modelName, command, jsl, idl },
}) {
  const schema = getDataValidationSchema({ idl, modelName, command });
  const attrs = getAttrs(args);

  return Object.entries(attrs).reduce(
    (inputA, [dataVar, attr]) =>
      validateAttr({ input: inputA, dataVar, attr, schema, jsl }),
    input,
  );
};

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

const validateSingleAttr = function ({
  input,
  input: { idl },
  dataVar,
  schema,
  jsl,
  data,
}) {
  const value = removeAllJsl(data);
  const reportInfo = { type, dataVar };
  validate({ idl, schema, data: value, reportInfo, extra: jsl });

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
