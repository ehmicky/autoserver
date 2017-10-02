'use strict';

const { throwError } = require('../../error');
const { getCommand } = require('../../constants');

const { getModel } = require('./get_model');

// Add `action.command` and `action.modelName`
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

// Parse a top-level commandName into tokens.
// E.g. `findMyModels` -> { commandType: 'find', modelName: 'my_models' }
const parseTopLevelAction = function ({ action, top: { command, modelName } }) {
  return { ...action, command, modelName };
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

  const command = getCommand({ commandType: 'find', multiple: isArray });

  return { ...action, command, modelName };
};

module.exports = {
  parseModels,
};
