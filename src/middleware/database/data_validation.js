'use strict';

const { omitBy } = require('../../utilities');
const { validate } = require('../../json_validation');

// Custom data validation middleware
// Check that filter|newData passes schema validation
// E.g. if a model is marked as `required` or `minimum: 10` in the schema,
// this will be validated here
const dataValidation = function ({
  args,
  modelName,
  command,
  schema: { shortcuts: { validateMap } },
  mInput,
}) {
  const compiledJsonSchema = validateMap[modelName][command];
  const attrs = getAttrs({ args });

  Object.entries(attrs).forEach(([dataVar, attr]) =>
    validateAttr({ dataVar, attr, compiledJsonSchema, mInput }));
};

// Keeps the arguments to validate
const getAttrs = function ({ args: { newData } }) {
  if (!newData) { return {}; }

  return { data: newData };
};

const validateAttr = function ({ dataVar, attr, compiledJsonSchema, mInput }) {
  attr.forEach(data => validateSingleAttr({
    dataVar,
    compiledJsonSchema,
    mInput,
    data,
  }));
};

const validateSingleAttr = function ({
  dataVar,
  compiledJsonSchema,
  mInput,
  data,
}) {
  const dataA = removeEmpty(data);

  validate({
    compiledJsonSchema,
    data: dataA,
    mInput,
    dataVar,
    reason: 'INPUT_VALIDATION',
    message: 'Wrong parameters',
  });
};

// In theory, the previous middleware should not leave any value null|undefined,
// so this should be a noop. This is just an extra safety.
// This converts null|undefined to "no key".
const removeEmpty = function (value) {
  return omitBy(value, prop => prop == null);
};

module.exports = {
  dataValidation,
};
