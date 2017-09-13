'use strict';

const { underscored } = require('underscore.string');
const { singular, plural } = require('pluralize');

const { throwError } = require('../../../../error');
const { ACTIONS } = require('../../../../constants');

// Add `action.actionConstant` and `action.modelName`
const parseModels = function ({ actions, modelsMap }) {
  const topLevelAction = parseTopLevelAction({ actions, modelsMap });
  const nestedActions = parseNestedActions({
    actions,
    modelsMap,
    topLevelAction,
  });
  return [topLevelAction, ...nestedActions]
    .map(addActionConstant);
};

// Parse a GraphQL query top-level action name into tokens.
// E.g. `findMyModels` -> { actionType: 'find', modelName: 'my_models' }
const parseTopLevelAction = function ({ actions, modelsMap }) {
  const [action] = actions;
  const { actionPath: [actionName] } = action;

  const { actionType, modelName } = parseName({ actionName });

  const modelNameA = underscored(modelName);

  const singularName = singular(modelNameA);
  const pluralName = plural(modelNameA);
  const isArray = modelNameA === pluralName;

  const modelNameB = modelsMap[pluralName] ? pluralName : singularName;

  validateTopLevel({ actionType, modelName: modelNameB, actionName });

  return { ...action, actionType, isArray, modelName: modelNameB };
};

const parseName = function ({ actionName }) {
  const [, actionType, modelName = ''] = nameRegExp.exec(actionName) || [];
  return { actionType, modelName };
};

// Matches e.g. 'findMyModels' -> ['find', 'MyModels'];
const nameRegExp = /^([a-z0-9]+)([A-Z][a-zA-Z0-9]*)/;

const validateTopLevel = function ({ actionType, modelName, actionName }) {
  if (actionType && modelName) { return; }

  const message = `Action '${actionName}' does not exist`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

const parseNestedActions = function ({ actions, modelsMap, topLevelAction }) {
  const nestedActions = actions.slice(1);
  return nestedActions.map(
    action => parseNestedAction({ action, topLevelAction, modelsMap })
  );
};

const parseNestedAction = function ({
  action,
  action: { actionPath, usesTopAction },
  topLevelAction,
  topLevelAction: { modelName: topModel },
  modelsMap,
}) {
  const { modelName, isArray } = getModel({
    modelsMap,
    modelName: topModel,
    actionPath: actionPath.slice(1),
  });

  const actionType = getNestedActionType({ usesTopAction, topLevelAction });
  return { ...action, actionType, isArray, modelName };
};

// Nested actions due to nested `args.data` reuses top-level action
// Others are simply for selection, i.e. are find actions
const getNestedActionType = function ({
  usesTopAction,
  topLevelAction: { actionType },
}) {
  if (!usesTopAction) { return 'find'; }

  return actionType;
};

const getModel = function ({ modelsMap, modelName, actionPath }) {
  const [actionName, ...childActionPath] = actionPath;

  if (!modelsMap[modelName][actionName]) {
    const message = `Attribute '${actionName}' is unknown`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  const {
    target: childModelName,
    isArray,
  } = modelsMap[modelName][actionName];

  if (childActionPath.length > 0) {
    return getModel({
      modelsMap,
      modelName: childModelName,
      actionPath: childActionPath,
    });
  }

  return { modelName: childModelName, isArray };
};

const addActionConstant = function ({ actionType, isArray, ...rest }) {
  const actionConstant = ACTIONS.find(
    ({ multiple, type }) => multiple === isArray && type === actionType
  );

  if (!actionConstant) {
    const message = `Action '${actionType}' does not exist`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return { actionConstant, ...rest };
};

module.exports = {
  parseModels,
};
