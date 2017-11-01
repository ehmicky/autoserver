'use strict';

const { singular, plural, isPlural } = require('pluralize');

const { throwError } = require('../../error');
const { COMMANDS } = require('../../constants');

// Parse a `operationDef` into a top-level action, i.e.:
// `command`, `modelName`, `commandPath`, `args`
const parseTopAction = function ({
  operationDef: { commandName, args },
  schema: { shortcuts: { modelsMap } },
  protocolArgs,
  paramsArg,
}) {
  const { commandType, modelName, multiple } = parseModelName({
    commandName,
    modelsMap,
  });
  const command = getCommand({ commandType, multiple });

  const commandPath = [commandName];

  const argsA = getArgs({ args, protocolArgs, paramsArg });

  const top = { command, modelName, commandPath, args: argsA };
  return { top, topArgs: top.args };
};

// Retrieve `command` and `modelName` using the main `commandName`
const parseModelName = function ({ commandName, modelsMap }) {
  const { commandType, modelName } = parseName({ commandName });

  const multiple = isPlural(modelName);

  // Model name can be either in singular or in plural form in schema
  const singularName = singular(modelName);
  const pluralName = plural(modelName);
  const modelNameA = modelsMap[pluralName] ? pluralName : singularName;

  if (!commandType || !modelNameA) {
    const message = `Command '${commandName}' is unknown`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return { commandType, modelName: modelNameA, multiple };
};

// Matches e.g. 'find_my_models' -> ['find', 'my_models'];
const parseName = function ({ commandName }) {
  const [, commandType, modelName = ''] = NAME_REGEXP.exec(commandName) || [];
  return { commandType, modelName };
};

const NAME_REGEXP = /^([a-z0-9]+)_([a-z0-9_]*)$/;

const getCommand = function ({ commandType, multiple }) {
  const commandA = COMMANDS.find(command =>
    command.multiple === multiple && command.type === commandType);

  if (commandA === undefined) {
    const message = `Command '${commandType}' is unknown`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return commandA;
};

// Merge protocol-specific arguments with normal arguments
const getArgs = function ({ args, protocolArgs, paramsArg }) {
  const params = { ...args.params, ...paramsArg };
  return { ...protocolArgs, ...args, params };
};

module.exports = {
  parseTopAction,
};
