'use strict';

const pluralize = require('pluralize');

const { getWordsList } = require('../utilities');

const { throwError } = require('./main');

const throwCommonError = function ({ reason, ...rest }) {
  commonErrors[reason](rest);
};

const throwAuthorizationError = function ({
  ids,
  modelName,
  top: { command: { title } },
}) {
  const models = getAuthorizationModels({ ids, modelName });
  const message = `It is not allowed to ${title} ${models}`;
  throwError(message, { reason: 'AUTHORIZATION' });
};

const getAuthorizationModels = function ({ ids, modelName }) {
  if (modelName === undefined) {
    return 'those models';
  }

  if (ids === undefined) {
    return `those '${modelName}' models`;
  }

  const idsA = getWordsList(ids, { op: 'and', quotes: true });
  return `the '${modelName}' ${pluralize('model', ids.length)} with 'id' ${idsA}`;
};

const throwModelNotFoundError = function ({ ids, modelName }) {
  const idsA = getWordsList(ids, { op: 'nor', quotes: true });
  const message = `Could not find any '${modelName}' with 'id' ${idsA}`;
  throwError(message, { reason: 'DB_MODEL_NOT_FOUND' });
};

const commonErrors = {
  AUTHORIZATION: throwAuthorizationError,
  DB_MODEL_NOT_FOUND: throwModelNotFoundError,
};

module.exports = {
  throwCommonError,
};
