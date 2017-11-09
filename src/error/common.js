'use strict';

const pluralize = require('pluralize');

const { getWordsList } = require('../utilities');

const { throwError } = require('./main');

const throwCommonError = function ({ reason, ...rest }) {
  const message = commonErrors[reason](rest);
  throwError(message, { reason });
};

const throwAuthorizationError = function ({
  ids,
  collname,
  top: { command: { participle } },
}) {
  const models = getModels({ collname, ids });
  return `${models} cannot be ${participle}`;
};

const throwModelNotFoundError = function ({ ids, collname }) {
  const models = getModels({ collname, ids });
  return `${models} could not be found`;
};

const throwConflictError = function ({ ids, collname }) {
  const models = getModels({ collname, ids });
  const exist = ids.length === 1 ? 'exists' : 'exist';
  return `${models} already ${exist}`;
};

// Try to make error messages start the same way when referring to models
const getModels = function ({ collname, ids, op = 'and' }) {
  if (collname === undefined) {
    return 'Those models';
  }

  if (ids === undefined) {
    return `Those '${collname}' models`;
  }

  const idsA = getWordsList(ids, { op, quotes: true });
  return `The '${collname}' ${pluralize('model', ids.length)} with 'id' ${idsA}`;
};

const commonErrors = {
  AUTHORIZATION: throwAuthorizationError,
  DB_MODEL_NOT_FOUND: throwModelNotFoundError,
  DB_CONFLICT: throwConflictError,
};

module.exports = {
  throwCommonError,
};
