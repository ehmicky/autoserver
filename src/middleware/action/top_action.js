'use strict';

const { underscored } = require('underscore.string');
const { singular, plural } = require('pluralize');

const { throwError } = require('../../error');
const { getCommand } = require('../../constants');

// Parse a top-level action name into tokens.
// E.g. `findMyModels` -> { commandType: 'find', modelName: 'my_models' }
const parseTopAction = function ({
  operationDef: { action, args },
  idl: { shortcuts: { modelsMap } },
  protocolArgs,
}) {
  const { command, modelName } = getModelInfo({ action, modelsMap });

  const commandPath = [action];

  const argsA = { ...protocolArgs, ...args };

  const top = { command, modelName, commandPath, args: argsA };
  return { top, topArgs: top.args };
};

const getModelInfo = function ({ action, modelsMap }) {
  const { commandType, modelName } = parseName({ action });

  const modelNameA = underscored(modelName);

  const singularName = singular(modelNameA);
  const pluralName = plural(modelNameA);
  const multiple = modelNameA === pluralName;

  const modelNameB = modelsMap[pluralName] ? pluralName : singularName;

  const command = getCommand({ commandType, multiple });

  validateAction({ modelName: modelNameB, action });

  return { command, modelName: modelNameB };
};

const parseName = function ({ action }) {
  const [, commandType, modelName = ''] = nameRegExp.exec(action) || [];
  return { commandType, modelName };
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
