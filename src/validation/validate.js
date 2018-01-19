'use strict';

const { errorMessages } = require('./messages');

// Perform a validation, using a JSON schema, and a `data` as input
const validate = function ({ compiledJsonSchema, data, extra = {} }) {
  // Hack to be able to pass information to custom validation keywords
  const dataA = { ...data, [Symbol.for('extra')]: extra };

  const isValid = compiledJsonSchema(dataA);

  const { errors } = compiledJsonSchema;
  const hasErrors = Array.isArray(errors) && errors.length > 0;

  if (isValid || !hasErrors) { return; }

  reportErrors({ errors });
};

// Report validation errors by throwing an exception, e.g. firing a HTTP 400
const reportErrors = function ({ errors }) {
  // Retrieve error message as string, from error objects
  const message = errors
    .map(error => getErrorMessage({ error }))
    .join('\n');

  // eslint-disable-next-line fp/no-throw
  throw new Error(message);
};

// Customize error messages when the library's ones are unclear
const getErrorMessage = function ({
  error,
  error: { keyword, message, dataPath },
}) {
  const getMessage = errorMessages[keyword];
  const messageA = getMessage === undefined
    // Failsafe
    ? ` ${message}`
    : getMessage(error);

  const messageB = addDataPath({ dataPath, message: messageA });
  return messageB;
};

// Remove leading dot
// Prepends argument name to error message
const addDataPath = function ({ dataPath, message }) {
  const dataPathA = jsonPointerToDots(dataPath);
  const messageA = `${dataPathA}${message}`;
  const messageB = messageA.replace(/^\./, '');
  return messageB;
};

// We use `jsonPointers` option because it is cleaner,
// but we want dots (for properties) and brackets (for indexes) not slashes
const jsonPointerToDots = function (dataPath) {
  return dataPath
    .substr(1)
    .replace(/\/(\d+)/g, '[$1]')
    .replace(/\//g, '.');
};

module.exports = {
  validate,
};
