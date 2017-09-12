'use strict';

const { isEqual } = require('lodash');
const { underscored } = require('underscore.string');
const { singular, plural } = require('pluralize');

const { throwError } = require('../../../../error');
const { ACTIONS } = require('../../../../constants');

const parseModels = function ({ actions, modelsMap }) {
  return actions.reduce(parseModelsReducer.bind(null, { modelsMap }), []);
};

const parseModelsReducer = function ({ modelsMap }, actions, action) {
  const actionA = parseAction({ actions, action, modelsMap });
  return [...actions, actionA];
};

const parseAction = function ({
  actions,
  action,
  action: { actionName, actionPath, isTopLevel },
  modelsMap,
}) {
  const parser = isTopLevel ? parseTopLevelAction : parseNestedAction;
  const { actionType, modelName, isArray } = parser({
    actionPath,
    actionName,
    actions,
    modelsMap,
  });
  const actionConstant = ACTIONS.find(
    ({ multiple, type }) => multiple === isArray && type === actionType
  );

  validateModels({ actionConstant, actionName, modelName, modelsMap });

  return { ...action, actionConstant, modelName };
};

// Parse a GraphQL query top-level action name into tokens.
// E.g. `findMyModels` -> { actionType: 'find', modelName: 'my_models' }
const parseTopLevelAction = function ({ actionName, modelsMap }) {
  const [, actionType, modelName = ''] = nameRegExp.exec(actionName) || [];

  const modelNameA = underscored(modelName);

  const singularName = singular(modelNameA);
  const pluralName = plural(modelNameA);
  const isArray = modelNameA === pluralName;

  const modelNameB = modelsMap[pluralName] ? pluralName : singularName;

  return { actionType, modelName: modelNameB, isArray };
};

// Matches e.g. 'findMyModels' -> ['find', 'MyModels'];
const nameRegExp = /^([a-z0-9]+)([A-Z][a-zA-Z0-9]*)/;

const parseNestedAction = function ({
  actionPath,
  actionName,
  actions,
  modelsMap,
}) {
  // Reuse top-level actionType
  const [{ actionConstant: { type: actionType } }] = actions;

  const parentActionPath = actionPath.slice(0, -1);
  const { modelName: parentModel } = actions.find(
    action => isEqual(action.actionPath, parentActionPath)
  );
  const {
    target: modelName,
    isArray,
  } = modelsMap[parentModel][actionName] || {};

  return { actionType, modelName, isArray };
};

// Make sure top-level action is valid syntactically and semantically
// (i.e. present in IDL)
const validateModels = function ({
  actionConstant,
  actionName,
  modelName,
  modelsMap,
}) {
  if (actionConstant && modelName && modelsMap[modelName]) { return; }

  const message = `Action '${actionName}' does not exist`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

module.exports = {
  parseModels,
};
