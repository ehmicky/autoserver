'use strict';

const { plural } = require('pluralize');

const { throwError } = require('../../../error');

// Validate collections are properly named
const validateCollname = function ({ schema, schema: { collections } }) {
  if (!(collections && collections.constructor === Object)) { return schema; }

  Object.keys(collections).forEach(checkCollname);

  return schema;
};

const checkCollname = function (collname) {
  const pluralname = plural(collname);
  // Collection name must be plural
  // The reason is to avoid having to handle different cases where the
  // collection name is sometimes singular, sometimes plural.
  // This is also easier for the user to remember.
  if (collname === pluralname) { return; }

  const message = `Collection's name '${collname}' must be in plural form, i.e. should be '${pluralname}'`;
  throwError(message, { reason: 'SCHEMA_VALIDATION' });
};

module.exports = {
  validateCollname,
};
