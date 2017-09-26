'use strict';

const { throwError } = require('../../../../error');

const {
  isTopLevelAction,
  getModel,
  getActionConstant,
} = require('./utilities');

// Add `action.actionConstant` and `action.modelName`
const parseModels = function ({ actions, topAction, topModel, modelsMap }) {
  return actions
    .map(action => parseAction({ action, topAction, topModel, modelsMap }));
};

const parseAction = function ({ action, topAction, topModel, modelsMap }) {
  const parser = isTopLevelAction(action)
    ? parseTopLevelAction
    : parseNestedAction;
  return parser({ action, topAction, topModel, modelsMap });
};

// Parse a GraphQL query top-level action name into tokens.
// E.g. `findMyModels` -> { actionType: 'find', modelName: 'my_models' }
const parseTopLevelAction = function ({ action, topAction, topModel }) {
  return { ...action, actionConstant: topAction, modelName: topModel };
};

const parseNestedAction = function ({
  action,
  action: { actionPath },
  topAction,
  topModel,
  modelsMap,
}) {
  const model = getModel({ modelsMap, topAction, topModel, actionPath });

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
