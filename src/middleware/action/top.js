'use strict';

const { deepMerge, uniq, flatten } = require('../../utilities');
const { throwError } = require('../../error');
const { COMMANDS } = require('../../constants');
const { getSumVars } = require('../../functions');

// Parse a `rpcDef` into a top-level action, i.e.:
// `collname`, `clientCollname`, `commandpath`, `args`
const parseTopAction = function ({
  rpcDef: { commandName, args },
  schema: { shortcuts: { collsNames } },
  topargs,
}) {
  const { args: argsA, sumVars } = getArgs({ args, topargs });

  const { command, collname, clientCollname } = parseCommandName({
    commandName,
    collsNames,
    args: argsA,
  });

  const commandpath = [collname];

  const action = { collname, clientCollname, commandpath, args: argsA };
  const actions = [action];
  const top = { ...action, command };

  return { top, topargs: argsA, ...sumVars, actions };
};

const getArgs = function ({ args, topargs }) {
  // Merge protocol-specific arguments with normal arguments
  const argsA = deepMerge(args, topargs);

  // `datasize` and `datacount` schema variables
  const { data } = argsA;
  const sumVars = getSumVars({ attrName: 'data', value: data });

  return { args: argsA, sumVars };
};

// Retrieve `command` and `collname` using the main `commandName`
const parseCommandName = function ({ commandName, collsNames, args }) {
  const [, commandType, clientCollname] = NAME_REGEXP.exec(commandName) || [];

  const collname = collsNames[clientCollname];

  validateCollname({ commandName, commandType, collname, collsNames });

  const command = getCommand({ commandType, args });

  return { command, collname, clientCollname };
};

// Matches e.g. 'find_my_coll' -> ['find', 'my_coll'];
const NAME_REGEXP = /^([a-z0-9]+)_([a-z0-9_]*)$/;

const validateCollname = function ({
  commandName,
  commandType,
  collname,
  collsNames,
}) {
  const isValid = commandType && collname && isMultiple[commandType];
  if (isValid) { return; }

  const message = `Command '${commandName}' is unknown`;
  const allowed = getAllowed({ collsNames });
  throwError(message, { reason: 'WRONG_COMMAND', extra: { allowed } });
};

// Returns all possible commands
const getAllowed = function ({ collsNames }) {
  const clientCollnames = Object.keys(collsNames);
  const commands = COMMANDS.map(({ type }) => type);
  const commandsA = uniq(commands);
  const allowed = commandsA
    .map(command => getAllowedCommand({ command, clientCollnames }));
  const allowedA = flatten(allowed);
  return allowedA;
};

const getAllowedCommand = function ({ command, clientCollnames }) {
  return clientCollnames.map(clientCollname => `${command}_${clientCollname}`);
};

// Retrieve `top.command`
const getCommand = function ({ commandType, args }) {
  const multiple = isMultiple[commandType](args);

  const commandA = COMMANDS.find(command =>
    command.multiple === multiple && command.type === commandType);
  return commandA;
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
