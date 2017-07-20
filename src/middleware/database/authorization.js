'use strict';

const { EngineError } = require('../../error');
const { COMMANDS } = require('../../constants');
const { assignObject } = require('../../utilities');

// Main authorization layer
const authorization = async function (input) {
  const { modelName, command, idl: { models }, args } = input;

  const model = models[modelName];
  validateCommands({ model, command, args });

  const response = await this.next(input);
  return response;
};

const validateCommands = function ({
  model: { commands },
  command,
  args: { authorization: shouldAuthorize },
}) {
  if (!shouldAuthorize) { return; }

  const mappedCommands = authorizationMap[command.name] || [command];

  for (const mappedCommand of mappedCommands) {
    const isAllowed = commands.includes(mappedCommand.name);

    if (!isAllowed) {
      const message = `Command '${mappedCommand.type}' is not allowed`;
      throw new EngineError(message, { reason: 'AUTHORIZATION' });
    }
  }
};

// `upsert` becomes `update` + `create` for authorization purpose
const { updateOne, createOne, updateMany, createMany } = COMMANDS
  .map(command => ({ [command.name]: command }))
  .reduce(assignObject, {});
const authorizationMap = {
  upsertOne: [updateOne, createOne],
  upsertMany: [updateMany, createMany],
};

module.exports = {
  authorization,
};
