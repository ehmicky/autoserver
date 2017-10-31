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
  modelName,
  top: { command: { participle } },
}) {
  const models = getModels({ modelName, ids });
  return `${models} cannot be ${participle}`;
};

const throwModelNotFoundError = function ({ ids, modelName }) {
  const models = getModels({ modelName, ids });
  return `${models} could not be found`;
};

// Try to make error messages start the same way when referring to models
const getModels = function ({ modelName, ids, op = 'and' }) {
  if (modelName === undefined) {
    return 'Those models';
  }

  if (ids === undefined) {
    return `Those '${modelName}' models`;
  }

  const idsA = getWordsList(ids, { op, quotes: true });
  return `The '${modelName}' ${pluralize('model', ids.length)} with 'id' ${idsA}`;
};

const commonErrors = {
  AUTHORIZATION: throwAuthorizationError,
  DB_MODEL_NOT_FOUND: throwModelNotFoundError,
};

module.exports = {
  throwCommonError,
};
