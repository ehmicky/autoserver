'use strict';

const { underscored } = require('underscore.string');
const { singular, plural } = require('pluralize');

const { throwError } = require('../../../../error');

const { getActionConstant } = require('./utilities');

// Parse a GraphQL query top-level action name into tokens.
// E.g. `findMyModels` -> { actionType: 'find', modelName: 'my_models' }
const parseTopAction = function ({ operation: { action, args }, modelsMap }) {
  const { actionType, modelName } = parseName({ action });

  const modelNameA = underscored(modelName);

  const singularName = singular(modelNameA);
  const pluralName = plural(modelNameA);
  const isArray = modelNameA === pluralName;

  const modelNameB = modelsMap[pluralName] ? pluralName : singularName;

  const actionConstant = getActionConstant({ actionType, isArray });

  validateAction({ modelName: modelNameB, action });

  const actionPath = [action];

  return { actionConstant, modelName: modelNameB, actionPath, args };
};

const parseName = function ({ action }) {
  const [, actionType, modelName = ''] = nameRegExp.exec(action) || [];
  return { actionType, modelName };
};

// Matches e.g. 'find_my_models' -> ['find', 'my_models'];
const nameRegExp = /^([a-z0-9]+)_([a-z0-9_]*)$/;

const validateAction = function ({ modelName, action }) {
  if (modelName) { return; }

  const message = `Action '${action}' is unknown`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

module.exports = {
  parseTopAction,
};
