'use strict';

const { deepMerge } = require('../../utilities');
const { throwError } = require('../../error');
const { COMMANDS } = require('../../constants');

// Parse a `rpcDef` into a top-level action, i.e.:
// `collname`, `commandpath`, `args`
const parseTopAction = function ({
  rpcDef: { commandName, args },
  schema: { shortcuts: { collsMap } },
  topargs,
}) {
  // Merge protocol-specific arguments with normal arguments
  const argsA = deepMerge(args, topargs);

  const { command, collname } = parseCommandName({
    commandName,
    collsMap,
    args: argsA,
  });

  const commandpath = [commandName];

  const action = { collname, commandpath, args: argsA };
  const actions = [action];
  const top = { ...action, command };

  return { top, topargs: argsA, actions };
};

// Retrieve `command` and `collname` using the main `commandName`
const parseCommandName = function ({ commandName, collsMap, args }) {
  const [, commandType, collname] = NAME_REGEXP.exec(commandName) || [];

  validateCollname({ commandName, commandType, collname, collsMap });

  const command = getCommand({ commandType, args });

  return { command, collname };
};

// Matches e.g. 'find_my_coll' -> ['find', 'my_coll'];
const NAME_REGEXP = /^([a-z0-9]+)_([a-z0-9_]*)$/;

const validateCollname = function ({
  commandName,
  commandType,
  collname,
  collsMap,
}) {
  if (!commandType || !collname) {
    const message = `Command '${commandName}' is unknown`;
    throwError(message, { reason: 'WRONG_COMMAND' });
  }

  if (!collsMap[collname]) {
    const message = `Collection '${collname}' is unknown`;
    throwError(message, { reason: 'WRONG_COMMAND' });
  }
};

// Retrieve `top.command`
const getCommand = function ({ commandType, args }) {
  const multiple = isMultiple[commandType](args);

  const commandA = COMMANDS.find(command =>
    command.multiple === multiple && command.type === commandType);
  if (commandA !== undefined) { return commandA; }

  const message = `Command '${commandType}' is unknown`;
  throwError(message, { reason: 'WRONG_COMMAND' });
};

const hasNoId = ({ id }) => id === undefined;
const hasDataArray = ({ data }) => Array.isArray(data);

// A command is multiple is it has a `args.id` or
// (for create|upsert) a single `args.data`
const isMultiple = {
  find: hasNoId,
  create: hasDataArray,
  upsert: hasDataArray,
  patch: hasNoId,
  delete: hasNoId,
};

module.exports = {
  parseTopAction,
};
