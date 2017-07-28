'use strict';

const { TYPES, NO_CONSOLE_TYPES, LEVELS } = require('../../constants');

const { getRequestMessage } = require('./request_message');

// Build a standardized log message:
// [TYPE] [LEVEL] [SERVER_NAME] [TIMESTAMP] [PHASE] MESSAGE - SUBMESSAGE
//   STACK_TRACE
// `PHASE` is requestId if phase is `request`
const getConsoleMessage = function ({
  phase,
  type,
  level,
  timestamp,
  requestId,
  requestInfo,
  serverInfo: { serverName },
  rawMessage,
}) {
  const noConsole = NO_CONSOLE_TYPES.includes(type);
  if (noConsole) { return; }

  const prefix = getPrefix({
    phase,
    type,
    level,
    timestamp,
    requestId,
    serverName,
  });
  const requestMessage = phase === 'request' && type === 'call'
    ? getRequestMessage(requestInfo)
    : rawMessage;

  const message = `${prefix} ${requestMessage}`;
  return message;
};

// Retrieves `[TYPE] [LEVEL] [SERVER_NAME] [TIMESTAMP] [PHASE]`
const getPrefix = function ({
  phase,
  type,
  level,
  timestamp,
  requestId,
  serverName,
}) {
  const prefixes = [
    getType({ type }),
    getLevel({ level }),
    getServerName({ serverName }),
    getTimestamp({ timestamp }),
    getRequestId({ phase, requestId }),
  ];
  const prefix = prefixes.map(val => `[${val}]`).join(' ');
  return prefix;
};

const getType = function ({ type }) {
  return type.toUpperCase().padEnd(typesMaxLength);
};

const typesMaxLength = Math.max(...TYPES.map(type => type.length));

const getLevel = function ({ level }) {
  return level.toUpperCase().padEnd(levelsMaxLength);
};

const levelsMaxLength = Math.max(...LEVELS.map(level => level.length));

const getServerName = function ({ serverName }) {
  return serverName.substr(0, serverNameMaxLength).padEnd(serverNameMaxLength);
};

const serverNameMaxLength = 12;

const getTimestamp = function ({ timestamp }) {
  return timestamp.replace('T', ' ').replace(/([0-9])Z$/, '$1');
};

// Either requestId (if phase `request`), or the phase itself
const getRequestId = function ({ phase, requestId = phase.toUpperCase() }) {
  return requestId.substr(0, requestIdLength).padEnd(requestIdLength);
};

const requestIdLength = 8;

module.exports = {
  getConsoleMessage,
};
