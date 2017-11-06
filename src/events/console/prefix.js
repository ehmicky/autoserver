'use strict';

const { TYPES, LEVELS } = require('../constants');

// Retrieves `[TYPE] [LEVEL] [SERVERNAME] [TIMESTAMP] [PHASE]`
const getPrefix = function ({
  type,
  phase,
  level,
  timestamp,
  requestinfo: { requestId } = {},
  servername,
}) {
  const prefixes = [
    getType({ type }),
    getLevel({ level }),
    getServername({ servername }),
    getTimestamp({ timestamp }),
    getRequestId({ phase, requestId }),
  ];
  const prefix = prefixes.map(val => `[${val}]`).join(' ');
  return prefix;
};

const getType = function ({ type }) {
  return type
    .toUpperCase()
    .padEnd(TYPES_MAX_LENGTH);
};

const TYPES_MAX_LENGTH = Math.max(...TYPES.map(type => type.length));

const getLevel = function ({ level }) {
  return level
    .toUpperCase()
    .padEnd(LEVELS_MAX_LENGTH);
};

const LEVELS_MAX_LENGTH = Math.max(...LEVELS.map(level => level.length));

const getServername = function ({ servername }) {
  return servername
    .substr(0, SERVERNAME_LENGTH)
    .padEnd(SERVERNAME_LENGTH);
};

const SERVERNAME_LENGTH = 12;

const getTimestamp = function ({ timestamp }) {
  return timestamp.replace('T', ' ').replace(/([0-9])Z$/, '$1');
};

// Either requestId (if phase `request`), or the phase itself
const getRequestId = function ({ phase, requestId = phase.toUpperCase() }) {
  return requestId
    .substr(0, REQUEST_ID_LENGTH)
    .padEnd(REQUEST_ID_LENGTH);
};

const REQUEST_ID_LENGTH = 8;

module.exports = {
  getPrefix,
};
