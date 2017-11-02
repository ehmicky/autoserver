'use strict';

const { singular, plural, isPlural } = require('pluralize');

const { throwError } = require('../../error');
const { COMMANDS } = require('../../constants');

// Parse a `operationDef` into a top-level action, i.e.:
// `modelName`, `commandPath`, `args`
const parseTopAction = function ({
  operationDef: { commandName, args },
  schema: { shortcuts: { modelsMap } },
  protocolArgs,
  paramsArg,
}) {
  const { command, modelName } = parseModelName({ commandName, modelsMap });

  const commandPath = [commandName];

  const topArgs = getArgs({ args, protocolArgs, paramsArg });

  const action = { modelName, commandPath, args: topArgs };
  const actions = [action];
  const top = { ...action, command };

  return { top, topArgs, actions };
};

// Retrieve `command` and `modelName` using the main `commandName`
const parseModelName = function ({ commandName, modelsMap }) {
  const { commandType, modelName } = parseName({ commandName });

  const command = getCommand({ commandType, modelName });

  const modelNameA = getModelName({ modelsMap, modelName });

  return { command, modelName: modelNameA };
};

// Matches e.g. 'find_my_models' -> ['find', 'my_models'];
const parseName = function ({ commandName }) {
  const [, commandType, modelName] = NAME_REGEXP.exec(commandName) || [];

  if (commandType && modelName) {
    return { commandType, modelName };
  }

  const message = `Command '${commandName}' is unknown`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

const NAME_REGEXP = /^([a-z0-9]+)_([a-z0-9_]*)$/;

// Retrieve top.command
const getCommand = function ({ commandType, modelName }) {
  const multiple = isPlural(modelName);

  const commandA = COMMANDS.find(command =>
    command.multiple === multiple && command.type === commandType);
  if (commandA !== undefined) { return commandA; }

  const message = `Command '${commandType}' is unknown`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

// Retrieve top.modelName
const getModelName = function ({ modelsMap, modelName }) {
  // Model name can be either in singular or in plural form in schema
  const singularName = singular(modelName);
  const pluralName = plural(modelName);

  if (modelsMap[pluralName]) { return pluralName; }

  if (modelsMap[singularName]) { return singularName; }

  const message = `Model '${modelName}' is unknown`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

// Merge protocol-specific arguments with normal arguments
const getArgs = function ({ args, protocolArgs, paramsArg }) {
  const params = { ...args.params, ...paramsArg };
  return { ...protocolArgs, ...args, params };
};

module.exports = {
  parseTopAction,
};
