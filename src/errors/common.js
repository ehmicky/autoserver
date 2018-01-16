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
  top: { command: { participle } },
  clientCollname,
}) {
  const models = getModels({ clientCollname, ids });
  return `${models} cannot be ${participle}`;
};

const throwModelNotFoundError = function ({ ids, clientCollname }) {
  const models = getModels({ clientCollname, ids });
  return `${models} could not be found`;
};

const throwConflictError = function ({ ids, clientCollname }) {
  const models = getModels({ clientCollname, ids });
  const exist = ids.length === 1 ? 'exists' : 'exist';
  return `${models} already ${exist}`;
};

// Try to make error messages start the same way when referring to models
const getModels = function ({ ids, op = 'and', clientCollname }) {
  if (clientCollname === undefined) {
    return 'Those models';
  }

  if (ids === undefined) {
    return `Those '${clientCollname}' models`;
  }

  const idsA = getWordsList(ids, { op, quotes: true });
  const models = `The '${clientCollname}' ${pluralize('model', ids.length)} with 'id' ${idsA}`;
  return models;
};

const commonErrors = {
  AUTHORIZATION: throwAuthorizationError,
  NOT_FOUND: throwModelNotFoundError,
  MODEL_CONFLICT: throwConflictError,
};

module.exports = {
  throwCommonError,
};
