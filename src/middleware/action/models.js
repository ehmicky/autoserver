'use strict';

const { throwError } = require('../../error');
const { getCommand } = require('../../constants');

const { getModel } = require('./get_model');

// Add `action.command` and `action.modelName`,
// using `action.commandPath`, `top.command` and `top.modelName`
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

// Top-level action was already parsed by previous middleware
const parseTopLevelAction = function ({ action, top: { command, modelName } }) {
  return { ...action, command, modelName };
};

// Nested actions use their `commandPath`, by going through the `modelsMap`
// shortcut
const parseNestedAction = function ({
  action,
  action: { commandPath },
  top,
  modelsMap,
}) {
  const model = getModel({ commandPath, modelsMap, top });

  if (model === undefined) {
    const message = `Attribute '${commandPath.join('.')}' is unknown`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  const { modelName, multiple } = model;

  // Nested actions created through `args.select` use `find` commands
  const command = getCommand({ commandType: 'find', multiple });

  return { ...action, command, modelName };
};

module.exports = {
  parseModels,
};
