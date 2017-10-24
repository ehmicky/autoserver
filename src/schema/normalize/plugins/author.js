'use strict';

const { throwError } = require('../../../error');
const { isInlineFunc } = require('../../../schema_func');

const { attributesPlugin } = require('./attributes');

// Plugin that adds who modified last each model:
//   created_by {User} - set on model creation
//   updated_by {User} - set on model creation, modification or deletion
// Are handled by the system, and cannot be overriden by users
// User is specified by opts:
//   [currentUser] {inlineFunc} - current user
//   [userModel] {string} - user's model name
const authorPlugin = function ({ schema, opts }) {
  validateConf({ schema, opts });
  return attributesPlugin({ getAttributes })({ schema, opts });
};

const validateConf = function ({ schema, opts: { currentUser, userModel } }) {
  validateCurrentUser({ currentUser });
  validateUserModel({ schema, userModel });
};

const validateCurrentUser = function ({ currentUser }) {
  if (!currentUser || !isInlineFunc({ inlineFunc: currentUser })) {
    const message = 'In \'author\' plugin, \'opts.currentUser\' must be an inline function';
    throwError(message, { reason: 'SCHEMA_VALIDATION' });
  }
};

const validateUserModel = function ({ schema, userModel }) {
  if (typeof userModel !== 'string') {
    const message = 'In \'author\' plugin, \'opts.userModel\' must be a string';
    throwError(message, { reason: 'SCHEMA_VALIDATION' });
  }

  if (schema.models[userModel] === undefined) {
    const message = `'author' plugin requires 'models.${userModel}'`;
    throwError(message, { reason: 'SCHEMA_VALIDATION' });
  }
};

const getAttributes = ({ currentUser, userModel }) => ({
  created_by: {
    description: 'Who created this model',
    type: userModel,
    readonly: true,
    value: `($command === "create" ? ${currentUser} && ${currentUser}.id : null)`,
  },
  updated_by: {
    description: 'Who last updated this model',
    type: userModel,
    value: `(${currentUser} && ${currentUser}.id)`,
  },
});

module.exports = {
  authorPlugin,
};
