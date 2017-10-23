'use strict';

const { throwError } = require('../../error');

// Main authorization layer
const authorization = function ({
  modelName,
  command,
  schema: { models },
  args: { internal },
}) {
  // Intermediary commands are not checked for authorization
  if (internal) { return; }

  const { commands } = models[modelName];
  const mappedCommands = AUTHORIZATION_MAP[command] || [command];

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

// `patch` requires both `find` and `replace` authorizations
const AUTHORIZATION_MAP = {
  patch: ['find', 'replace'],
};

module.exports = {
  authorization,
};
