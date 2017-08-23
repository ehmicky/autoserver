'use strict';

const { omitBy } = require('../../../utilities');
const { validate } = require('../../../validation');

const { getDataValidationSchema } = require('./schema');

// Custom data validation middleware
// Check that input filter|newData passes IDL validation
// E.g. if a model is marked as `required` or `minimum: 10` in IDL file,
// this will be validated here
const dataValidation = function (input) {
  const { args, modelName, command, idl } = input;

  const schema = getDataValidationSchema({ idl, modelName, command });
  const attrs = getAttrs({ args });

  Object.entries(attrs).forEach(
    ([dataVar, attr]) => validateAttr({ idl, dataVar, attr, schema, input }),
  );
};

// Keeps the arguments to validate
// TODO: validate `filter`
const getAttrs = function ({ args }) {
  if (!args.newData) { return {}; }

  return { data: args.newData };
};

const validateAttr = function ({ idl, dataVar, attr, schema, input }) {
  const attrArray = Array.isArray(attr) ? attr : [attr];

  return attrArray.forEach(
    data => validateSingleAttr({ idl, dataVar, schema, input, data }),
  );
};

const validateSingleAttr = function ({ idl, dataVar, schema, input, data }) {
  const dataA = removeEmpty(data);

  const reportInfo = { type, dataVar };

  validate({ idl, schema, data: dataA, reportInfo, extra: input });
};

const type = 'clientInputData';

// In theory, the previous middleware should not leave any value null|undefined,
// so this should be a noop. This is just an extra safety.
// This converts null|undefined to "no key".
const removeEmpty = function (value) {
  return omitBy(value, prop => prop == null);
};

module.exports = {
  dataValidation,
};
