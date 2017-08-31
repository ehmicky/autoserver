'use strict';

const { omitBy } = require('../../utilities');
const { validate } = require('../../json_validation');

// Custom data validation middleware
// Check that filter|newData passes IDL validation
// E.g. if a model is marked as `required` or `minimum: 10` in IDL file,
// this will be validated here
const dataValidation = function ({
  args,
  modelName,
  command,
  idl: { shortcuts: { validateMap } },
  mInput,
}) {
  const compiledSchema = validateMap[modelName][command.name];
  const attrs = getAttrs({ args });

  Object.entries(attrs).forEach(([dataVar, attr]) =>
    validateAttr({ dataVar, attr, compiledSchema, mInput }),
  );
};

// Keeps the arguments to validate
// TODO: validate `filter`
const getAttrs = function ({ args }) {
  if (!args.newData) { return {}; }

  return { data: args.newData };
};

const validateAttr = function ({ dataVar, attr, compiledSchema, mInput }) {
  const attrArray = Array.isArray(attr) ? attr : [attr];

  attrArray.forEach(
    data => validateSingleAttr({ dataVar, compiledSchema, mInput, data }),
  );
};

const validateSingleAttr = function ({
  dataVar,
  compiledSchema,
  mInput,
  data,
}) {
  const dataA = removeEmpty(data);

  validate({
    compiledSchema,
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
