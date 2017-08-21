'use strict';

const { throwError } = require('../../error');
const { COMMANDS } = require('../../constants');
const { assignObject } = require('../../utilities');

// Main authorization layer
const authorization = function (nextFunc, input) {
  const { modelName, command, idl: { models }, args } = input;

  const model = models[modelName];
  const inputA = validateCommands({ input, model, command, args });

  return nextFunc(inputA);
};

const validateCommands = function ({
  input,
  model: { commands },
  command,
  args: { internal },
}) {
  // Intermediary commands are not checked for authorization
  if (internal) { return input; }

  const mappedCommands = authorizationMap[command.name] || [command];

  return mappedCommands.reduce(
    (inputA, mappedCommand) =>
      validateCommand({ input: inputA, commands, mappedCommand }),
    input,
  );
};

const validateCommand = function ({ input, commands, mappedCommand }) {
  const isAllowed = commands.includes(mappedCommand.name);

  if (!isAllowed) {
    const message = `Command '${mappedCommand.type}' is not allowed`;
    throwError(message, { reason: 'AUTHORIZATION' });
  }

  return input;
};

const {
  readOne,
  readMany,
  updateOne,
  createOne,
  updateMany,
  createMany,
} = COMMANDS
  .map(command => ({ [command.name]: command }))
  .reduce(assignObject, {});
const authorizationMap = {
  // `upsert` action requires both `update` + `create` commands
  upsertOne: [updateOne, createOne],
  upsertMany: [updateMany, createMany],
  // `update` action requires both `update` + `read` commands
  updateOne: [updateOne, readOne],
  updateMany: [updateMany, readMany],
};

module.exports = {
  authorization,
};
