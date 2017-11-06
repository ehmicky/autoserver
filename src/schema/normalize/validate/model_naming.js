'use strict';

const { singular, plural } = require('pluralize');

const { throwError } = require('../../../error');

// Validate models are properly named
const validateModelNaming = function ({ schema }) {
  if (!schema.models) { return schema; }

  return Object.keys(schema.models).reduce(
    (schemaA, modelname) => checkModelname({ schema: schemaA, modelname }),
    schema,
  );
};

const checkModelname = function ({ schema, modelname }) {
  // Checks that a word (e.g. a model) is an English word with a
  // different singular and plural form
  if (singular(modelname) === plural(modelname)) {
    const message = `Model name '${modelname}' must be an English word whose plural form differs from its singular form`;
    throwError(message, { reason: 'SCHEMA_VALIDATION' });
  }

  return schema;
};

module.exports = {
  validateModelNaming,
};
