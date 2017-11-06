'use strict';

const { singular, plural, isPlural } = require('pluralize');

const { throwError } = require('../../error');
const { COMMANDS } = require('../../constants');

// Parse a `operationDef` into a top-level action, i.e.:
// `modelname`, `commandpath`, `args`
const parseTopAction = function ({
  operationDef: { commandName, args },
  schema: { shortcuts: { modelsMap } },
  protocolArgs,
  paramsArg,
}) {
  const { command, modelname } = parseModelname({ commandName, modelsMap });

  const commandpath = [commandName];

  const topargs = getArgs({ args, protocolArgs, paramsArg });

  const action = { modelname, commandpath, args: topargs };
  const actions = [action];
  const top = { ...action, command };

  return { top, topargs, actions };
};

// Retrieve `command` and `modelname` using the main `commandName`
const parseModelname = function ({ commandName, modelsMap }) {
  const { commandType, modelname } = parseName({ commandName });

  const command = getCommand({ commandType, modelname });

  const modelnameA = getModelname({ modelsMap, modelname });

  return { command, modelname: modelnameA };
};

// Matches e.g. 'find_my_models' -> ['find', 'my_models'];
const parseName = function ({ commandName }) {
  const [, commandType, modelname] = NAME_REGEXP.exec(commandName) || [];

  if (commandType && modelname) {
    return { commandType, modelname };
  }

  const message = `Command '${commandName}' is unknown`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

const NAME_REGEXP = /^([a-z0-9]+)_([a-z0-9_]*)$/;

// Retrieve top.command
const getCommand = function ({ commandType, modelname }) {
  const multiple = isPlural(modelname);

  const commandA = COMMANDS.find(command =>
    command.multiple === multiple && command.type === commandType);
  if (commandA !== undefined) { return commandA; }

  const message = `Command '${commandType}' is unknown`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

// Retrieve top.modelname
const getModelname = function ({ modelsMap, modelname }) {
  // Model name can be either in singular or in plural form in schema
  const singularName = singular(modelname);
  const pluralName = plural(modelname);

  if (modelsMap[pluralName]) { return pluralName; }

  if (modelsMap[singularName]) { return singularName; }

  const message = `Model '${modelname}' is unknown`;
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
