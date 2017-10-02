'use strict';

const { throwError } = require('../../error');
const { getActionConstant } = require('../../constants');

const { getModel } = require('./get_model');

// Add `action.actionConstant` and `action.modelName`
const parseModels = function ({
  actions,
  top,
  idl: { shortcuts: { modelsMap } },
}) {
  const actionsA = actions
    .map(action => parseAction({ action, top, modelsMap }));
  return { actions: actionsA };
};

const parseAction = function ({ action, top, modelsMap }) {
  const parser = action.commandPath.length === 1
    ? parseTopLevelAction
    : parseNestedAction;
  return parser({ action, top, modelsMap });
};

// Parse a top-level action name into tokens.
// E.g. `findMyModels` -> { actionType: 'find', modelName: 'my_models' }
const parseTopLevelAction = function ({
  action,
  top: { actionConstant, modelName },
}) {
  return { ...action, actionConstant, modelName };
};

const parseNestedAction = function ({
  action,
  action: { commandPath },
  top,
  modelsMap,
}) {
  const model = getModel({ modelsMap, top, commandPath });

  if (!model) {
    const message = `Attribute '${commandPath.join('.')}' is unknown`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  const { modelName, isArray } = model;

  const actionConstant = getActionConstant({ actionType: 'find', isArray });

  return { ...action, actionConstant, modelName };
};

module.exports = {
  parseModels,
};
