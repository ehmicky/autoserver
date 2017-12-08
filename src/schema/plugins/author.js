'use strict';

const { throwError } = require('../../error');
const { isInlineFunc } = require('../../functions');

const { attributesPlugin } = require('./attributes');

// Plugin that adds who modified last each model:
//   created_by {User} - set on model creation
//   updated_by {User} - set on model creation, modification or deletion
// Are handled by the system, and cannot be overriden by users
// User is specified by opts:
//   [currentuser] {inlineFunc} - current user
//   [collection] {string} - user's collection name
const authorPlugin = function ({ schema, opts }) {
  validateConf({ schema, opts });
  return attributesPlugin({ getAttributes })({ schema, opts });
};

const validateConf = function ({
  schema,
  opts: { currentuser, collection: collname },
}) {
  validateCurrentUser({ currentuser });
  validateUserModel({ schema, collname });
};

const validateCurrentUser = function ({ currentuser }) {
  if (!currentuser || !isInlineFunc({ inlineFunc: currentuser })) {
    const message = 'In \'author\' plugin, \'opts.currentuser\' must be an inline function';
    throwError(message, { reason: 'SCHEMA_VALIDATION' });
  }
};

const validateUserModel = function ({ schema, collname }) {
  if (typeof collname !== 'string') {
    const message = 'In \'author\' plugin, \'opts.collection\' must be a string';
    throwError(message, { reason: 'SCHEMA_VALIDATION' });
  }

  if (schema.collections[collname] === undefined) {
    const message = `'author' plugin requires 'collections.${collname}'`;
    throwError(message, { reason: 'SCHEMA_VALIDATION' });
  }
};

const getAttributes = ({ currentuser, collection: collname }) => ({
  created_by: {
    description: 'Who created this model',
    type: collname,
    value: `(previousmodel === undefined ? (${currentuser} && ${currentuser}.id) : previousvalue)`,
  },
  updated_by: {
    description: 'Who last updated this model',
    type: collname,
    value: `(${currentuser} && ${currentuser}.id)`,
  },
});

module.exports = {
  authorPlugin,
};
