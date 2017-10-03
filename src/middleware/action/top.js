'use strict';

const { singular, plural } = require('pluralize');

const { throwError } = require('../../error');
const { getCommand } = require('../../constants');

// Parse a `operationDef` into a top-level action, i.e.:
// `command`, `modelName`, `commandPath`, `args`
const parseTopAction = function ({
  operationDef: { commandName, args },
  idl: { shortcuts: { modelsMap } },
  protocolArgs,
}) {
  const { commandType, modelName, multiple } = parseModelName({
    commandName,
    modelsMap,
  });
  const command = getCommand({ commandType, multiple });

  const commandPath = [commandName];

  // Merge protocol-specific arguments with normal arguments
  const argsA = { ...protocolArgs, ...args };

  const top = { command, modelName, commandPath, args: argsA };
  return { top, topArgs: top.args };
};

// Retrieve `command` and `modelName` using the main `commandName`
const parseModelName = function ({ commandName, modelsMap }) {
  const { commandType, modelName } = parseName({ commandName });

  // Model name can be either in singular or in plural form in IDL
  const singularName = singular(modelName);
  const pluralName = plural(modelName);
  const multiple = modelName === pluralName;

  const modelNameA = modelsMap[pluralName] ? pluralName : singularName;

  if (modelNameA === undefined) {
    const message = `Command '${commandName}' is unknown`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return { commandType, modelName: modelNameA, multiple };
};

// Matches e.g. 'find_my_models' -> ['find', 'my_models'];
const parseName = function ({ commandName }) {
  const [, commandType, modelName = ''] = nameRegExp.exec(commandName) || [];
  return { commandType, modelName };
};

const nameRegExp = /^([a-z0-9]+)_([a-z0-9_]*)$/;

module.exports = {
  parseTopAction,
};
