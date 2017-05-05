'use strict';


const { EngineStartupError } = require('../../error');
const { isJsl } = require('../../jsl');
const { propertiesPlugin } = require('./properties');


// Plugin that adds who modified last each model:
//   created_by {User} - set on model creation
//   updated_by {User} - set on model creation, modification or deletion
// Are handled by the system, and cannot be overriden by users
// User is specified by opts:
//   [user="($user)"] {jsl} - current user
//   [model="user"] {string} - user's model name
const authorPlugin = function ({ idl, opts }) {
  const { user, model } = opts;
  if (user && !isJsl({ jsl: user })) {
    throw new EngineStartupError('In \'author\' plugin, \'user\' must be a JSL string', { reason: 'IDL_VALIDATION' });
  }
  if (model && (typeof model !== 'string' || !idl.models[model])) {
    throw new EngineStartupError('In \'author\' plugin, \'model\' is invalid', { reason: 'IDL_VALIDATION' });
  }

  return propertiesPlugin({ getProperties, requiredProperties })({ idl, opts });
};

const getProperties = ({ user = '($user)', model = 'user' }) => ({
  created_by: {
    type: 'object',
    description: 'Who created this model',
    model,
    compute: `(["create", "upsert"].includes($ACTION) ? ${user}.id)`,
    readOnly: true,
    writeOnce: true,
  },
  updated_by: {
    type: 'object',
    description: 'Who last updated this model',
    model,
    compute: `(${user}.id)`,
    readOnly: true,
  },
});
const requiredProperties = ['updated_by'];


module.exports = {
  authorPlugin,
};
