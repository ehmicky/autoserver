'use strict';

const { validate } = require('../../validation');

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

  newData.forEach((data, index) => validate({
    compiledJsonSchema,
    data,
    extra: { mInput, currentDatum: currentData[index] },
    ...VALIDATE_OPTS,
  }));
};

const VALIDATE_OPTS = {
  reason: 'INPUT_VALIDATION',
  message: 'Wrong parameters',
};

module.exports = {
  dataValidation,
};
