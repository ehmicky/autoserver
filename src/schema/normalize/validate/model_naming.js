'use strict';

const { plural } = require('pluralize');

const { throwError } = require('../../../error');

// Validate models are properly named
const validateModelNaming = function ({ schema, schema: { models } }) {
  if (!(models && models.constructor === Object)) { return schema; }

  Object.keys(models).forEach(checkModelname);

  return schema;
};

const checkModelname = function (modelname) {
  const pluralname = plural(modelname);
  // Model name must be plural
  // The reason is to avoid having to handle different cases where the model
  // name is sometimes singular, sometimes plural. This is also easier for
  // the user to remember.
  if (modelname === pluralname) { return; }

  const message = `Model name '${modelname}' must be in plural form, i.e. should be '${pluralname}'`;
  throwError(message, { reason: 'SCHEMA_VALIDATION' });
};

module.exports = {
  validateModelNaming,
};
