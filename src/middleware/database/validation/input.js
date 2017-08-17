'use strict';

const { omitBy } = require('../../../utilities');
const { validate } = require('../../../validation');

const { getDataValidationSchema } = require('./schema');

// Check that input filter|newData passes IDL validation
// E.g. if a model is marked as `required` or `minimum: 10` in IDL file,
// this will be validated here
const validateInputData = function ({
  input,
  input: { args, modelName, command, ifv, idl },
}) {
  const schema = getDataValidationSchema({ idl, modelName, command });
  const attrs = getAttrs(args);

  return Object.entries(attrs).reduce(
    (inputA, [dataVar, attr]) =>
      validateAttr({ input: inputA, dataVar, attr, schema, ifv }),
    input,
  );
};

// Keeps the arguments to validate
// TODO: validate `filter`
const getAttrs = function (args) {
  if (!args.newData) { return {}; }

  return { data: args.newData };
};

const validateAttr = function ({ input, dataVar, attr, schema, ifv }) {
  const attrArray = Array.isArray(attr) ? attr : [attr];

  return attrArray.reduce(
    (inputA, data) =>
      validateSingleAttr({ input: inputA, dataVar, schema, ifv, data }),
    input,
  );
};

const validateSingleAttr = function ({
  input,
  input: { idl },
  dataVar,
  schema,
  ifv,
  data,
}) {
  const dataA = removeEmpty(data);

  const reportInfo = { type, dataVar };

  validate({ idl, schema, data: dataA, reportInfo, extra: ifv });

  return input;
};

const type = 'clientInputData';

// In theory, the previous middleware should not leave any value null|undefined,
// so this should be a noop. This is just an extra safety.
// This converts null|undefined to "no key".
const removeEmpty = function (value) {
  return omitBy(value, prop => prop == null);
};

module.exports = {
  validateInputData,
};
