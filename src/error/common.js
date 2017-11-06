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
  modelname,
  top: { command: { participle } },
}) {
  const models = getModels({ modelname, ids });
  return `${models} cannot be ${participle}`;
};

const throwModelNotFoundError = function ({ ids, modelname }) {
  const models = getModels({ modelname, ids });
  return `${models} could not be found`;
};

const throwConflictError = function ({ ids, modelname }) {
  const models = getModels({ modelname, ids });
  const exist = ids.length === 1 ? 'exists' : 'exist';
  return `${models} already ${exist}`;
};

// Try to make error messages start the same way when referring to models
const getModels = function ({ modelname, ids, op = 'and' }) {
  if (modelname === undefined) {
    return 'Those models';
  }

  if (ids === undefined) {
    return `Those '${modelname}' models`;
  }

  const idsA = getWordsList(ids, { op, quotes: true });
  return `The '${modelname}' ${pluralize('model', ids.length)} with 'id' ${idsA}`;
};

const commonErrors = {
  AUTHORIZATION: throwAuthorizationError,
  DB_MODEL_NOT_FOUND: throwModelNotFoundError,
  DB_CONFLICT: throwConflictError,
};

module.exports = {
  throwCommonError,
};
