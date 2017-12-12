'use strict';

const { omitBy } = require('../../utilities');
const { validate } = require('../../json_validation');

// Custom data validation middleware
// Check that newData passes config validation
// E.g. if a model is marked as `required` or `minimum: 10` in the
// config, this will be validated here
const dataValidation = function ({
  args: { newData, currentData },
  collname,
  config: { shortcuts: { validateMap } },
  mInput,
}) {
  if (newData === undefined) { return; }

  const compiledJsonSchema = validateMap[collname];

  newData.forEach((newDatum, index) => validateAttr({
    dataVar: 'data',
    compiledJsonSchema,
    mInput,
    newDatum,
    currentDatum: currentData[index],
  }));
};

const validateAttr = function ({
  dataVar,
  compiledJsonSchema,
  mInput,
  newDatum,
  currentDatum,
}) {
  const newDatumA = removeEmpty(newDatum);

  validate({
    compiledJsonSchema,
    data: newDatumA,
    dataVar,
    reason: 'INPUT_VALIDATION',
    message: 'Wrong parameters',
    extra: { mInput, currentDatum },
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
