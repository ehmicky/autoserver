'use strict';

const { throwError } = require('../../error');

// Main authorization layer
const authorization = function ({
  modelName,
  command,
  idl: { models },
  args: { internal },
}) {
  // Intermediary commands are not checked for authorization
  if (internal) { return; }

  const { commands } = models[modelName];
  const mappedCommands = authorizationMap[command] || [command];

  mappedCommands
    .forEach(mappedCommand => validateCommand({ commands, mappedCommand }));
};

const validateCommand = function ({ commands, mappedCommand }) {
  const isAllowed = commands.includes(mappedCommand);

  if (!isAllowed) {
    const message = `Command '${mappedCommand}' is not allowed`;
    throwError(message, { reason: 'AUTHORIZATION' });
  }
};

const authorizationMap = {
  upsert: ['update', 'create'],
  update: ['update', 'read'],
};

module.exports = {
  authorization,
};
