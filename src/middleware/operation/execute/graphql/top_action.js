'use strict';

const { underscored } = require('underscore.string');
const { singular, plural } = require('pluralize');

const { throwError } = require('../../../../error');

const { getActionConstant } = require('./utilities');

// Parse a GraphQL query top-level action name into tokens.
// E.g. `findMyModels` -> { actionType: 'find', modelName: 'my_models' }
const parseTopAction = function ({ operation: { action }, modelsMap }) {
  const { actionType, modelName } = parseName({ action });

  const modelNameA = underscored(modelName);

  const singularName = singular(modelNameA);
  const pluralName = plural(modelNameA);
  const isArray = modelNameA === pluralName;

  const topModel = modelsMap[pluralName] ? pluralName : singularName;

  const topAction = getActionConstant({ actionType, isArray });

  validateTopLevel({ topModel, action });

  const topActionPath = [action];

  return { topAction, topModel, topActionPath };
};

const parseName = function ({ action }) {
  const [, actionType, modelName = ''] = nameRegExp.exec(action) || [];
  return { actionType, modelName };
};

// Matches e.g. 'find_my_models' -> ['find', 'my_models'];
const nameRegExp = /^([a-z0-9]+)_([a-z0-9_]*)$/;

const validateTopLevel = function ({ topModel, action }) {
  if (topModel) { return; }

  const message = `Action '${action}' is unknown`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

module.exports = {
  parseTopAction,
};
