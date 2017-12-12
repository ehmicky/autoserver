'use strict';

const { throwError } = require('../../../error');

const { attributesPlugin } = require('./attributes');

// Plugin that adds who modified last each model:
//   created_by {User} - set on model creation
//   updated_by {User} - set on model creation, modification or deletion
// Are handled by the system, and cannot be overriden by users
// User is specified by opts:
//   [currentuser] {function} - current user
//   [collection] {string} - user's collection name
const authorPlugin = function ({ config, opts }) {
  validateConf({ config, opts });

  return attributesPlugin({ getAttributes })({ config, opts });
};

const validateConf = function ({ config, opts: { currentuser, collection } }) {
  if (typeof currentuser !== 'function') {
    const message = 'In \'author\' plugin, \'opts.currentuser\' must be a function';
    throwError(message, { reason: 'CONF_VALIDATION' });
  }

  if (typeof collection !== 'string') {
    const message = 'In \'author\' plugin, \'opts.collection\' must be a string';
    throwError(message, { reason: 'CONF_VALIDATION' });
  }

  if (config.collections[collection] === undefined) {
    const message = `'author' plugin requires 'collections.${collection}'`;
    throwError(message, { reason: 'CONF_VALIDATION' });
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

const getCreatedBy = function (currentuser, params) {
  const { previousmodel, previousvalue } = params;

  if (previousmodel !== undefined) { return previousvalue; }

  return currentuser(params).id;
};

const getUpdatedBy = function (currentuser, params) {
  return currentuser(params).id;
};

module.exports = {
  authorPlugin,
};
