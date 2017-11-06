'use strict';

const { throwError } = require('../../../error');
const { isInlineFunc } = require('../../../schema_func');

const { attributesPlugin } = require('./attributes');

// Plugin that adds who modified last each model:
//   created_by {User} - set on model creation
//   updated_by {User} - set on model creation, modification or deletion
// Are handled by the system, and cannot be overriden by users
// User is specified by opts:
//   [currentuser] {inlineFunc} - current user
//   [usermodel] {string} - user's model name
const authorPlugin = function ({ schema, opts }) {
  validateConf({ schema, opts });
  return attributesPlugin({ getAttributes })({ schema, opts });
};

const validateConf = function ({ schema, opts: { currentuser, usermodel } }) {
  validateCurrentUser({ currentuser });
  validateUserModel({ schema, usermodel });
};

const validateCurrentUser = function ({ currentuser }) {
  if (!currentuser || !isInlineFunc({ inlineFunc: currentuser })) {
    const message = 'In \'author\' plugin, \'opts.currentuser\' must be an inline function';
    throwError(message, { reason: 'SCHEMA_VALIDATION' });
  }
};

const validateUserModel = function ({ schema, usermodel }) {
  if (typeof usermodel !== 'string') {
    const message = 'In \'author\' plugin, \'opts.usermodel\' must be a string';
    throwError(message, { reason: 'SCHEMA_VALIDATION' });
  }

  if (schema.models[usermodel] === undefined) {
    const message = `'author' plugin requires 'models.${usermodel}'`;
    throwError(message, { reason: 'SCHEMA_VALIDATION' });
  }
};

const getAttributes = ({ currentuser, usermodel }) => ({
  created_by: {
    description: 'Who created this model',
    type: usermodel,
    value: `($previousmodel === undefined ? (${currentuser} && ${currentuser}.id) : $previousval)`,
  },
  updated_by: {
    description: 'Who last updated this model',
    type: usermodel,
    value: `(${currentuser} && ${currentuser}.id)`,
  },
});

module.exports = {
  authorPlugin,
};
