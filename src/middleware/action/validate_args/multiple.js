'use strict';

const {
  difference,
  intersection,
  getWordsList,
} = require('../../../utilities');
const { throwError } = require('../../../error');
const { COMMANDS } = require('../../../constants');

const COMMANDS_ARGS = require('./commands');

// Better error messages for arguments that should be only in *One or only
// in *Many commands
const validateMultiple = function ({ args, command }) {
  const otherCommand = COMMANDS.find(({ type, multiple }) =>
    type === command.type && multiple !== command.multiple);

  const wrongArgs = getWrongArgs({ args, command, otherCommand });
  if (wrongArgs.length === 0) { return; }

  const wrongArgsA = getWordsList(wrongArgs, { op: 'and', quotes: true });
  const message = messages[command.name];
  const messageA = `Wrong arguments: ${wrongArgsA} cannot be specified ${message}`;
  throwError(messageA, { reason: 'INPUT_VALIDATION' });
};

const getWrongArgs = function ({ args, command, otherCommand }) {
  const allowedArgs = getAllowedParams({ command });
  const otherArgs = getAllowedParams({ command: otherCommand });
  const currentArgs = Object.keys(args);

  const forbiddenArgs = difference(currentArgs, allowedArgs);
  const wrongArgs = intersection(forbiddenArgs, otherArgs);
  return wrongArgs;
};

const getAllowedParams = function ({ command }) {
  const { optional, required } = COMMANDS_ARGS[command.name];
  return [...optional, ...required];
};

const multipleId = 'if the \'id\' argument is also specified';
const singleId = 'unless the \'id\' argument is also specified';
const multipleData = 'unless the \'data\' argument is a single object';
const singleData = 'unless the \'data\' argument is an array';

const messages = {
  findOne: multipleId,
  findMany: singleId,
  deleteOne: multipleId,
  deleteMany: singleId,
  patchOne: multipleId,
  patchMany: singleId,
  createOne: multipleData,
  createMany: singleData,
  upsertOne: multipleData,
  upsertMany: singleData,
};

module.exports = {
  validateMultiple,
};
