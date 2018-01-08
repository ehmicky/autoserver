'use strict';

const { plural } = require('pluralize');

const { throwError } = require('../../errors');

// Validate collections are properly named
const validateClientCollnames = function ({ config: { collections } }) {
  if (!(collections && collections.constructor === Object)) { return; }

  Object.values(collections).forEach(checkCollnames);
};

const checkCollnames = function ({ name }) {
  name.forEach(nameA => checkCollname({ name: nameA }));
};

const checkCollname = function ({ name }) {
  const pluralname = plural(name);
  // Collection name must be plural
  // The reason is to avoid having to handle different cases where the
  // collection name is sometimes singular, sometimes plural.
  // This is also easier for the user to remember.
  if (name === pluralname) { return; }

  const message = `Collection's name '${name}' must be in plural form, i.e. should be '${pluralname}'`;
  throwError(message, { reason: 'CONFIG_VALIDATION' });
};

module.exports = {
  validateClientCollnames,
};
