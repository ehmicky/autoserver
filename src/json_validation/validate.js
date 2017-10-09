'use strict';

const { assignArray } = require('../utilities');

const { reportErrors } = require('./report_error');

// Perform a validation, using a JSON schema, and a `data` as input
const validate = function ({
  compiledJsonSchema,
  data,
  dataVar,
  reason,
  message,
  mInput,
}) {
  const dataA = { ...data, [Symbol.for('mInput')]: mInput };
  const isValid = compiledJsonSchema(dataA);
  if (isValid) { return; }

  const errors = compiledJsonSchema.errors
    .reduce(assignArray, [])
    .filter(val => val);

  if (errors.length === 0) { return; }

  reportErrors({ errors, dataVar, reason, message });
};

module.exports = {
  validate,
};
