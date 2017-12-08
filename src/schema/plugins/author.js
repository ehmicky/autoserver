'use strict';

const { throwError } = require('../../error');

const { attributesPlugin } = require('./attributes');

// Plugin that adds who modified last each model:
//   created_by {User} - set on model creation
//   updated_by {User} - set on model creation, modification or deletion
// Are handled by the system, and cannot be overriden by users
// User is specified by opts:
//   [currentuser] {function} - current user
//   [collection] {string} - user's collection name
const authorPlugin = function ({ schema, opts }) {
  validateConf({ schema, opts });

  return attributesPlugin({ getAttributes })({ schema, opts });
};

const validateConf = function ({ schema, opts: { currentuser, collection } }) {
  if (typeof currentuser !== 'function') {
    const message = 'In \'author\' plugin, \'opts.currentuser\' must be a function';
    throwError(message, { reason: 'SCHEMA_VALIDATION' });
  }

  if (typeof collection !== 'string') {
    const message = 'In \'author\' plugin, \'opts.collection\' must be a string';
    throwError(message, { reason: 'SCHEMA_VALIDATION' });
  }

  if (schema.collections[collection] === undefined) {
    const message = `'author' plugin requires 'collections.${collection}'`;
    throwError(message, { reason: 'SCHEMA_VALIDATION' });
  }
};

const getAttributes = ({ currentuser, collection }) => ({
  created_by: {
    description: 'Who created this model',
    type: collection,
    value: getCreatedBy.bind(null, currentuser),
  },
  updated_by: {
    description: 'Who last updated this model',
    type: collection,
    value: getUpdatedBy.bind(null, currentuser),
  },
});

const getCreatedBy = function (currentuser, vars) {
  const { previousmodel, previousvalue } = vars;

  if (previousmodel !== undefined) { return previousvalue; }

  return currentuser(vars).id;
};

const getUpdatedBy = function (currentuser, vars) {
  return currentuser(vars).id;
};

module.exports = {
  authorPlugin,
};
