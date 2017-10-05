'use strict';

const { throwError } = require('../../../error');
const { isInlineFunc } = require('../../../idl_func');

const { attributesPlugin } = require('./attributes');

// Plugin that adds who modified last each model:
//   created_by {User} - set on model creation
//   updated_by {User} - set on model creation, modification or deletion
// Are handled by the system, and cannot be overriden by users
// User is specified by opts:
//   [currentUser="(user())"] {inlineFunc} - current user
//   [userModel="user"] {string} - user's model name
const authorPlugin = function ({ idl, opts }) {
  validateConf({ idl, opts });
  return attributesPlugin({ getAttributes })({ idl, opts });
};

const validateConf = function ({
  idl,
  opts: { currentUser, userModel = 'user' },
}) {
  if (currentUser && !isInlineFunc({ inlineFunc: currentUser })) {
    const message = 'In \'author\' plugin, \'currentUser\' must be an inline function';
    throwError(message, { reason: 'IDL_VALIDATION' });
  }

  if (typeof userModel !== 'string') {
    const message = `In 'author' plugin, 'userModel' must be a string: ${userModel}`;
    throwError(message, { reason: 'IDL_VALIDATION' });
  }

  if (!idl.models[userModel]) {
    const message = `'author' plugin requires 'models.${userModel}'`;
    throwError(message, { reason: 'IDL_VALIDATION' });
  }
};

const getAttributes = ({ currentUser = '(user())', userModel = 'user' }) => ({
  created_by: {
    description: 'Who created this model',
    type: userModel,
    readonly: true,
    value: `($COMMAND === "create" ? ${currentUser}.id : null)`,
  },
  updated_by: {
    description: 'Who last updated this model',
    type: userModel,
    value: `(${currentUser}.id)`,
  },
});

module.exports = {
  authorPlugin,
};
