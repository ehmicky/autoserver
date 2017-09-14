'use strict';

const { underscored } = require('underscore.string');
const { singular, plural } = require('pluralize');

const { throwError } = require('../../../../error');

const {
  getTopLevelAction,
  isTopLevelAction,
  getModel,
  getActionConstant,
} = require('./utilities');

// Add `action.actionConstant` and `action.modelName`
const parseModels = function ({ actions, modelsMap }) {
  const topLevelAction = parseTopLevelAction({ actions, modelsMap });
  const nestedActions = parseNestedActions({
    actions,
    modelsMap,
    topLevelAction,
  });
  return [topLevelAction, ...nestedActions];
};

// Parse a GraphQL query top-level action name into tokens.
// E.g. `findMyModels` -> { actionType: 'find', modelName: 'my_models' }
const parseTopLevelAction = function ({ actions, modelsMap }) {
  const topLevelAction = getTopLevelAction({ actions });
  const { actionPath: [actionName] } = topLevelAction;

  const { actionType, modelName } = parseName({ actionName });

  const modelNameA = underscored(modelName);

  const singularName = singular(modelNameA);
  const pluralName = plural(modelNameA);
  const isArray = modelNameA === pluralName;

  const modelNameB = modelsMap[pluralName] ? pluralName : singularName;

  const actionConstant = getActionConstant({ actionType, isArray });

  validateTopLevel({ modelName: modelNameB, actionName });

  return { ...topLevelAction, actionConstant, modelName: modelNameB };
};

const parseName = function ({ actionName }) {
  const [, actionType, modelName = ''] = nameRegExp.exec(actionName) || [];
  return { actionType, modelName };
};

// Matches e.g. 'findMyModels' -> ['find', 'MyModels'];
const nameRegExp = /^([a-z0-9]+)([A-Z][a-zA-Z0-9]*)/;

const validateTopLevel = function ({ modelName, actionName }) {
  if (modelName) { return; }

  const message = `Action '${actionName}' does not exist`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

const parseNestedActions = function ({ actions, modelsMap, topLevelAction }) {
  return actions
    .filter(action => !isTopLevelAction(action))
    .map(action => parseNestedAction({ action, topLevelAction, modelsMap }));
};

const parseNestedAction = function ({
  action,
  action: { actionPath },
  topLevelAction,
  modelsMap,
}) {
  const model = getModel({ modelsMap, topLevelAction, actionPath });

  if (!model) {
    const message = `Attribute '${actionPath.join('.')}' is unknown`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  const { modelName, isArray } = model;

  const actionConstant = getActionConstant({ actionType: 'find', isArray });

  return { ...action, actionConstant, modelName };
};

module.exports = {
  parseModels,
};
