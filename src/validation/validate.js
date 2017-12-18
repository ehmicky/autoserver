'use strict';

const { reportErrors } = require('./report_error');

// Perform a validation, using a JSON schema, and a `data` as input
const validate = function ({
  compiledJsonSchema,
  data,
  dataVar,
  message,
  reason,
  extra = {},
}) {
  // Hack to be able to pass information to custom validation keywords
  const dataA = { ...data, [Symbol.for('extra')]: extra };

  const isValid = compiledJsonSchema(dataA);

  const { errors } = compiledJsonSchema;
  const hasErrors = Array.isArray(errors) && errors.length > 0;

  if (isValid || !hasErrors) { return; }

  reportErrors({ errors, dataVar, message, reason });
};

module.exports = {
  validate,
};
