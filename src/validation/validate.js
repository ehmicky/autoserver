'use strict';

const { assignArray } = require('../utilities');

const { reportErrors } = require('./report_error');

// Perform a validation, using a JSON schema, and a `data` as input
const validate = function ({
  compiledSchema,
  data,
  dataVar,
  reason,
  message,
  mInput,
}) {
  const dataA = { ...data, [Symbol.for('mInput')]: mInput };
  const isValid = compiledSchema(dataA);
  if (isValid) { return; }

  const errors = compiledSchema.errors
    .reduce(assignArray, [])
    .filter(val => val);

  if (errors.length === 0) { return; }

  reportErrors({ errors, dataVar, reason, message });
};

module.exports = {
  validate,
};
