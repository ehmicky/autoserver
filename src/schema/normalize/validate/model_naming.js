'use strict';

const { singular, plural } = require('pluralize');

const { throwError } = require('../../../error');

// Validate models are properly named
const validateModelNaming = function ({ schema }) {
  if (!schema.models) { return schema; }

  return Object.keys(schema.models).reduce(
    (schemaA, modelName) => checkModelName({ schema: schemaA, modelName }),
    schema,
  );
};

const checkModelName = function ({ schema, modelName }) {
  // Checks that a word (e.g. a model) is an English word with a
  // different singular and plural form
  if (singular(modelName) === plural(modelName)) {
    const message = `Model name '${modelName}' must be an English word whose plural form differs from its singular form`;
    throwError(message, { reason: 'SCHEMA_VALIDATION' });
  }

  return schema;
};

module.exports = {
  validateModelNaming,
};
